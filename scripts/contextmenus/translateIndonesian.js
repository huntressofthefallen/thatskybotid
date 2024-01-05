const embedBuilder = require('../builders/embed');
const translate = require('../translate');
const errorHandler = require('../src/errorHandler');

module.exports = async (interaction) => {
	const message = await interaction.targetMessage.fetch().catch(err => errorHandler(err));
	let embedTitle, embedDescription, content, embed;

	if (message.embeds[0]) {
		embedTitle = await translate(message.embeds[0].title, { to: 'ID' });
		embedDescription = await translate(message.embeds[0].description, { to: 'ID' });

		embed = embedBuilder({
			client: interaction.client,
			user: interaction.user,
			title: embedTitle,
			description: embedDescription,
		});
	}

	if (message.content) {
		content = await translate(message.content, { to: 'ID' });
	}

	if (embed && content) {
		await interaction.editReply({ content: content, embeds: [embed], ephemeral: true }).catch(err => errorHandler(err));
	}
	else if (content) {
		await interaction.editReply({ content: content, ephemeral: true }).catch(err => errorHandler(err));
	}
	else if (embed) {
		await interaction.editReply({ embeds: [embed], ephemeral: true }).catch(err => errorHandler(err));
	}
	else {
		await interaction.editReply({ content: 'Error 500 - The bot unable to translate this message.', ephemeral: true }).catch(err => errorHandler(err));
	}
};