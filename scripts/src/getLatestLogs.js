const { log } = require('../../database/lib/s');

// Function to get the latest logs and format them into a string
module.exports = async (userId) => {
	const logs = await log.find({ userId }).sort({ updatedAt: -1 }).limit(10).catch(err => console.error(err.message));

	if (logs.length === 0) {
		return 'No moderation logs found.';
	}

	let logString = '----------\n';
	for (const logdata of logs) {
		logString += `- **Database _id:** ${logdata._id}\n`;
		logString += `- **Action:** ${logdata.action}\n`;
		logString += `- **User:** ${logdata.userTag} (ID: ${logdata.userId})\n`;
		logString += `- **Moderator:** ${logdata.modTag} (ID: ${logdata.modId})\n`;
		logString += `- **Reason:** ${logdata.reason}\n`;
		logString += `- **Timestamp:** ${logdata.createdAt.toUTCString()}\n`;
		logString += '----------\n';
	}

	return logString;
};