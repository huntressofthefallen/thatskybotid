const translate = require('./scripts/translate');

const test = async () => {
	const translated = await translate('Hello, world', { to: 'ID' });
	console.log(translated.data.translations[0].text);
};

test();