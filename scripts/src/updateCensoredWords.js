const { modConfig } = require('../../database/lib/s');

/**
 * Update or add multiple censored words in the modConfig schema.
 * @param {string} guildId - The ID of the guild.
 * @param {Object[]} censoredWords - Array of censored word objects to add or update.
 * @param {string} censoredWords[].word - The censored word.
 * @param {boolean} censoredWords[].automod - Whether the automod is enabled for this word.
 * @param {number} censoredWords[].category - The category number of the censored word.
 */
async function updateCensoredWords(guildId, censoredWords) {
	for (const censoredWord of censoredWords) {
		await modConfig.updateOne(
			{ guildId },
			{
				$set: {
					'censoredWords.$[element].automod': censoredWord.automod,
					'censoredWords.$[element].category': censoredWord.category,
				},
				$addToSet: { censoredWords: censoredWord },
			},
			{
				arrayFilters: [{ 'element.word': censoredWord.word }],
				upsert: true,
			},
		);
	}
}

module.exports = updateCensoredWords;