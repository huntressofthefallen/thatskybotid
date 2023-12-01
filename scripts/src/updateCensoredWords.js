const { modConfig } = require('../../database/lib/s');
const errorHandler = require('./errorHandler');

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
		// Check if the word already exists
		const existingWord = await modConfig.findOne(
			{ guildId, 'censoredWords.word': censoredWord.word },
		);

		if (existingWord) {
			// Update existing element
			await modConfig.updateOne(
				{ guildId, 'censoredWords.word': censoredWord.word },
				{
					$set: {
						'censoredWords.$[element]': {
							...censoredWord,
						},
					},
					arrayFilters: [{ 'element.word': censoredWord.word }],
				},
			).catch(err => errorHandler(err));
		}
		else {
			// Add new element
			await modConfig.updateOne(
				{ guildId },
				{
					$push: {
						censoredWords: {
							...censoredWord,
						},
					},
				},
			).catch(err => errorHandler(err));
		}
	}
}

module.exports = updateCensoredWords;