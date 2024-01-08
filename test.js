const translate = require('./scripts/translate');

const test = async () => {
	let translated = await translate('Hello, world!', { to: 'ID' });
	console.log(translated);

	translated = await translate('Halo, semuanya!', { to: 'EN' });
	console.log(translated);
};

test();