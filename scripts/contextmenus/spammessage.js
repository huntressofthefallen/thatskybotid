const checkEscalation = require('../src/checkEscalation');
const ban = require('../commands/ban');
const warning = require('../commands/warn');
const kick = require('../commands/kick');
const mute = require('../commands/mute');

/**
 * Convert milliseconds to a time string with 'd', 'h', or 'm' units.
 * @param {number} milliseconds - The number of milliseconds to convert.
 * @returns {string|null} The time string in 'd', 'h', or 'm' units, or null if the input value is negative.
 */
function convertToString(milliseconds) {
	if (milliseconds < 0) return null;

	const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
	const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
	const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));

	let timeString = '';
	if (days > 0) {
		timeString += `${days}d`;
	}
	if (hours > 0) {
		timeString += `${hours}h`;
	}
	if (minutes > 0) {
		timeString += `${minutes}m`;
	}

	return timeString || null;
}

/**
 * Perform the next escalation step based on the user's recent infractions.
 * @param {import('discord.js').CommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the ban action.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	await interaction.targetMessage.fetch().catch((err) => console.error(err.message));
	const userId = interaction.targetMessage.author.id;
	const guildId = interaction.guild.id;
	options.reason = 'Melakukan spam yang dapat mengganggu kenyamanan pemain. Baca peraturan server di sini: <#1010418542266560532>';

	const escalation = await checkEscalation(userId, guildId);

	if (!escalation) {
		await warning(interaction, options);
	}
	else {
		switch (escalation.action) {
			case 'ban':
				await ban(interaction, options);
				break;
			case 'warning':
				await warning(interaction, options);
				break;
			case 'kick':
				await kick(interaction, options);
				break;
			case 'mute':
				options.duration = convertToString(escalation.duration);
				await mute(interaction, options);
				break;
			default:
				await warning(interaction, options);
				break;
		}
	}

	if (interaction.targetMessage.deletable) {
		await interaction.targetMessage.delete().catch(err => console.error(err.message));
	}
};

// Credits: Huntress of the Fallen