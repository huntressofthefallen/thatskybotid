module.exports = async (interaction) => {
	const args = interaction.options.getString('search').toLowerCase().trim().split(/ +/);

	let searchparam = '';
	args.forEach((arg, i) => {
		if (i > 0) {
			searchparam = `${searchparam}%20${arg}`;
		}
		else if (i == 0) {
			searchparam = arg;
		}
	});
	require('../src/wikifetch')(interaction, searchparam).catch(err => console.error(err));
};