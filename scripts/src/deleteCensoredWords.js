const { modConfig } = require('../../database/lib/s');

/**
 * Delete multiple censored words from the modConfig schema.
 * @param {string} guildId - The ID of the guild.
 * @param {string[]} wordsToDelete - Array of censored words to delete.
 */
async function deleteCensoredWords(guildId, wordsToDelete) {
	await modConfig.updateOne(
		{ guildId },
		{
			$pull: { censoredWords: { word: { $in: wordsToDelete } } },
		},
	);
}

module.exports = deleteCensoredWords;