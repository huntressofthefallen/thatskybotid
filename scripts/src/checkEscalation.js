const { log, modConfig } = require('../../database/lib/s');

/**
 * Convert a time string with 'm', 'h', or 'd' units to milliseconds.
 * @param {string} timeString - A string representing a time value, e.g. '30m', '2h', '1d'.
 * @returns {number|null} The time value in milliseconds or null if the input string does not match the expected format.
 */
function convertToMilliseconds(timeString) {
	const timeValue = parseInt(timeString, 10);
	const timeUnit = timeString.slice(-1);

	switch (timeUnit) {
		case 'm':
			return timeValue * 60 * 1000;
		case 'h':
			return timeValue * 60 * 60 * 1000;
		case 'd':
			return timeValue * 24 * 60 * 60 * 1000;
		default:
			return null;
	}
}

/**
 * Convert milliseconds to a time string with 'm', 'h', or 'd' units.
 * @param {number} milliseconds - The time value in milliseconds.
 * @returns {string|null} The time value in the format 'm', 'h', or 'd', or null if the input is not a number.
 */
function convertMillisecondsToTimeString(milliseconds) {
	if (typeof milliseconds !== 'number') {
		return null;
	}

	if (milliseconds % (24 * 60 * 60 * 1000) === 0) {
		return `${milliseconds / (24 * 60 * 60 * 1000)}d`;
	}
	else if (milliseconds % (60 * 60 * 1000) === 0) {
		return `${milliseconds / (60 * 60 * 1000)}h`;
	}
	else {
		return `${milliseconds / (60 * 1000)}m`;
	}
}

/**
 * Get the next escalation step based on the user's recent infractions.
 * @param {string} userId - The user ID
 * @param {string} guildId - The guild ID
 * @returns {Object|null} The next escalation step or null if no escalation is needed.
 */
module.exports = async (userId, guildId) => {
	// Calculate the timestamps for the past day and past week
	const now = new Date();
	const pastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
	const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

	// Fetch logs for the past day and past week
	const logsPastDay = await log
		.find({
			userId: userId,
			guildId: guildId,
			createdAt: { $gte: pastDay },
		})
		.sort({ createdAt: 1 });

	const logsPastWeek = await log
		.find({
			userId: userId,
			guildId: guildId,
			createdAt: { $gte: pastWeek },
		})
		.sort({ createdAt: 1 });

	// Fetch server settings
	const serverSettings = await modConfig.findOne({ guildId: guildId });

	let escalationSteps;

	// Check if there are custom server settings for auto moderation
	if (!serverSettings || !serverSettings.autoModeration) {
		// Use default escalation steps
		escalationSteps = [
			{ action: 'warning', count: 2, timeframe: '1d' },
			{ action: 'mute', duration: 30 * 60 * 1000, timeframe: '1d' },
			{ action: 'warning', count: 2, timeframe: '1d' },
			{ action: 'mute', duration: 1 * 60 * 60 * 1000, timeframe: '1d' },
			{ action: 'warning', count: 2, timeframe: '1d' },
			{ action: 'mute', duration: 24 * 60 * 60 * 1000, timeframe: '7d' },
			{ action: 'warning', count: 2, timeframe: '7d' },
			{ action: 'kick', timeframe: '7d' },
			{ action: 'warning', count: 2, timeframe: '7d' },
			{ action: 'ban', timeframe: '7d' },
		];
	}
	else {
		// Use custom server settings for auto moderation
		escalationSteps = serverSettings.autoModConfig.map((config) => ({
			action: config.action,
			duration: config.length ? convertToMilliseconds(config.length) : null,
			count: config.count,
			timeframe: config.timeframe,
		}));
	}
	const countActions = (action, logs) => {
		return logs.filter((l) => l.action === action).length;
	};

	const majorActions7d = ['mute', 'kick', 'ban'];

	const findLatestMajorAction = (actions, logs) => {
		let latestAction = null;

		for (const action of actions) {
			const matchingLogs = logs.filter((l) => l.action === action);

			if (matchingLogs.length > 0) {
				const latestLog = matchingLogs.sort((a, b) => b.createdAt - a.createdAt)[0];

				if (!latestAction || latestLog.createdAt > latestAction.createdAt) {
					latestAction = latestLog;
				}
			}
		}
		return latestAction;
	};

	const findNearestDurationStep = (action, length) => {
		if (action !== 'mute') {
			return escalationSteps.find((step) => step.action === action);
		}

		const matchingStep = escalationSteps.find((step) => step.action === action && step.duration === convertToMilliseconds(length));
		if (matchingStep) {
			return matchingStep;
		}

		return escalationSteps
			.filter((step) => step.action === action)
			.reduce((nearestStep, currentStep) => {
				const currentStepDuration = currentStep.duration;
				const nearestStepDuration = nearestStep ? nearestStep.duration : null;

				if (!nearestStep || Math.abs(length - currentStepDuration) < Math.abs(length - nearestStepDuration)) {
					return currentStep;
				}
				else {
					return nearestStep;
				}
			}, null);
	};

	const logsPastWeekFiltered = logsPastWeek.filter((logPast) => {
		if (logPast.action === 'mute') {
			return convertToMilliseconds(logPast.length) >= 24 * 60 * 60 * 1000;
		}
		return majorActions7d.includes(logPast.action);
	});

	const latestMajorAction7d = findLatestMajorAction(majorActions7d, logsPastWeekFiltered);

	let nextStep = null;
	let warningsSinceLastMajorAction = 0;

	if (latestMajorAction7d) {
		const latestMajorActionTimestamp = latestMajorAction7d.createdAt;
		warningsSinceLastMajorAction = countActions('warning', logsPastWeek.filter((action) => action.createdAt > latestMajorActionTimestamp));

		if (warningsSinceLastMajorAction >= 2) {
			const latestStep = findNearestDurationStep(latestMajorAction7d.action, latestMajorAction7d.length);
			const currentStepIndex = escalationSteps.findIndex(step => step.action === latestStep.action && step.duration === latestStep.duration);
			nextStep = escalationSteps[currentStepIndex + 2];
		}
		else {
			nextStep = { action: 'warning' };
		}
	}
	else {
		const majorActions1d = ['mute'];
		const latestMajorAction1d = findLatestMajorAction(majorActions1d, logsPastDay);

		if (latestMajorAction1d) {
			const latestMajorActionTimestamp = latestMajorAction1d.createdAt;
			warningsSinceLastMajorAction = countActions('warning', logsPastDay.filter((action) => action.createdAt > latestMajorActionTimestamp));

			if (warningsSinceLastMajorAction >= 2) {
				const latestStep = findNearestDurationStep(latestMajorAction1d.action, latestMajorAction1d.length);
				const currentStepIndex = escalationSteps.findIndex(step => step.action === latestStep.action && step.duration === latestStep.duration);
				nextStep = escalationSteps[currentStepIndex + 2];
			}
			else {
				nextStep = { action: 'warning' };
			}
		}
		else {
			warningsSinceLastMajorAction = countActions('warning', logsPastDay);
			if (warningsSinceLastMajorAction >= 2) {
				nextStep = escalationSteps.find((step) => majorActions7d.includes(step.action));
			}
			else {
				nextStep = { action: 'warning' };
			}
		}
	}

	const escalation = {
		action: nextStep.action,
		duration: convertMillisecondsToTimeString(nextStep.duration),
	};

	console.log('Next escalation step:', escalation);

	return escalation;
};