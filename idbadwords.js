const fs = require('fs').promises;
const path = require('path');

const { modConfig } = require('./database/lib/s');

/**
 * Transforms a ServerSettingsSchema object into the desired format.
 * @param {ServerSettingsSchema} serverSettings - The server settings object.
 * @returns {Object} The transformed object.
 */
const transformServerSettings = (serverSettings) => {
	const result = {
		P1: [],
		P2: [],
		S: serverSettings.whitelistWords,
	};

	serverSettings.censoredWords.forEach((censoredWord) => {
		if (censoredWord.automod) {
			result.P1.push(censoredWord.word);
		}
		else {
			result.P2.push(censoredWord.word);
		}
	});

	return result;
};

/**
 * Fetches the modConfig data from the database, transforms it into the desired format,
 * and writes it to a JSON file.
 * @async
 */
const writeTransformedSettingsToFile = async () => {
	try {
		const data = await modConfig.findOne({ guildId: '1009644872065613864' });
		const transformedSettings = transformServerSettings(data);
		const filePath = path.join(__dirname, './database/idbadwords.json');
		await fs.writeFile(filePath, JSON.stringify(transformedSettings, null, 2));
	}
	catch (err) {
		console.error(err.message);
	}
};

module.exports = writeTransformedSettingsToFile;