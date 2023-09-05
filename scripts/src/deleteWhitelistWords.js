const { modConfig } = require('../../database/lib/s');

/**
 * Delete multiple whitelist words from the modConfig schema.
 * @param {string} guildId - The ID of the guild.
 * @param {string[]} wordsToDelete - Array of whitelist words to delete.
 */
async function deleteWhitelistWords(guildId, wordsToDelete) {
	await modConfig.updateOne(
		{ guildId },
		{
			$pull: { whitelistWords: { $in: wordsToDelete } },
		},
	);
}

module.exports = deleteWhitelistWords;