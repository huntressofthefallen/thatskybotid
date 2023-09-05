const { modConfig } = require('../../database/lib/s');

/**
 * Update or add multiple whitelist words in the modConfig schema.
 * @param {string} guildId - The ID of the guild.
 * @param {string[]} newWhitelistWords - Array of whitelist words to add.
 */
async function updateWhitelistWords(guildId, newWhitelistWords) {
	await modConfig.updateOne(
		{ guildId },
		{
			$addToSet: { whitelistWords: { $each: newWhitelistWords } },
		},
		{
			upsert: true,
		},
	);
}

module.exports = updateWhitelistWords;