const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate();

async function translateText(text, targetLanguage) {
	try {
		const [translation] = await translate.translate(text, targetLanguage);
		return translation;
	}
	catch (error) {
		console.error('Error:', error);
	}
}

module.exports = async (text, { to }) => {
	return await translateText(text, to);
};