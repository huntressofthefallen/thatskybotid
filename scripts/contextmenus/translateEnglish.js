const embedBuilder = require('../builders/embed');
const translate = require('../translate');

module.exports = async (interaction) => {
	const message = await interaction.message.fetch().catch(err => console.error(err.message));
	let embedTitle, embedDescription, content, embed;

	if (message.embeds[0]) {
		embedTitle = await translate(message.embeds[0].title, { to: 'en' });
		embedDescription = await translate(message.embeds[0].description, { to: 'en' });

		embed = embedBuilder({
			client: interaction.client,
			user: interaction.user,
			title: embedTitle,
			description: embedDescription,
		});
	}

	if (message.content) {
		content = await translate(message.content, { to: 'en' });
	}

	if (embed && content) {
		await interaction.editReply({ content: content, embeds: [embed], ephemeral: true }).catch(err => console.error(err.message));
	}
	else if (content) {
		await interaction.editReply({ content: content, ephemeral: true }).catch(err => console.error(err.message));
	}
	else if (embed) {
		await interaction.editReply({ embeds: [embed], ephemeral: true }).catch(err => console.error(err.message));
	}
	else {
		await interaction.editReply({ content: 'Error 500 - The bot unable to translate this message.', ephemeral: true }).catch(err => console.error(err.message));
	}
};