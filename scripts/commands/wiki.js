const translate = require('../translate');
module.exports = async (interaction) => {
	const keywords = await translate(interaction.options.getString('search'), { to: 'en' });
	const args = keywords.toLowerCase().trim().split(/ +/);

	let searchparam = '';
	args.forEach((arg, i) => {
		if (i > 0) {
			searchparam = `${searchparam}%20${arg}`;
		}
		else if (i == 0) {
			searchparam = arg;
		}
	});

	require('../src/wikiFetch')(interaction, searchparam);
};