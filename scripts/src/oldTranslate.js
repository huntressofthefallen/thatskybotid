const { Translate } = require('@google-cloud/translate').v2;
const projectId = 'funplus-user-center';
const keyFilename = './fp-platform-translation.json';
const translate = new Translate({ projectId, keyFilename });
const errorHandler = require('./src/errorHandler');

async function translateText(text, targetLanguage) {
	try {
		const [translation] = await translate.translate(text, targetLanguage);
		return translation;
	}
	catch (err) {
		errorHandler(err);
	}
}

module.exports = async (text, { to }) => {
	return await translateText(text, to);
};