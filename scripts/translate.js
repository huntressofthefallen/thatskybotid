require('dotenv').config();
const deepl = require('deepl-node');

module.exports = async (text, { to }) => {
	let translator = new deepl.Translator(process.env.DEEPLAUTH_PRIMARY);
	let usage = await translator.getUsage();
	console.log(`DEEPL Usage (PRIMARY): ${usage.character.count}, Limit: ${usage.character.limit}`);

	if (usage.character.limitReached()) {
		translator = new deepl.Translator(process.env.DEEPLAUTH_SECONDARY);
		usage = await translator.getUsage();
		console.log(`DEEPL Usage (SECONDARY): ${usage.character.count}, Limit: ${usage.character.limit}`);

		if (usage.character.limitReached()) {
			const response = '⚠️ Translation Pause: We\'ve hit a temporary limit.\n\nSorry for the inconvenience, but the translation feature is currently unavailable due to reaching its character limit. We\'re working to get it back up and running as soon as possible.';
			return response;
		}
	}

	const translate = await translator.translateText(text, null, to.toLowerCase() == 'en' ? 'en-US' : to, { preserveFormatting: true });
	const response = translate.text;

	return response;
};