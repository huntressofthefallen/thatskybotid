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
				// Update the existing element in the censoredWords array where the word matches
				$set: {
					'censoredWords.$[element]': {
						...censoredWord,
						updatedAt: { $currentDate: true },
					},
				},
				// Add the new element to the censoredWords array if the word doesn't exist
				$setOnInsert: {
					'censoredWords.$[element]': {
						...censoredWord,
						createdAt: { $currentDate: true },
						updatedAt: { $currentDate: true },
					},
				},
			},
			{
				// Filter the array element
				arrayFilters: [
					{ 'element.word': censoredWord.word },
				],
				// Create a new element if the word doesn't exist
				upsert: true,
			},
		);
	}
}

module.exports = updateCensoredWords;