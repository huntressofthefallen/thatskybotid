const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async (interaction) => {
	const modal = new ModalBuilder()
		.setCustomId('replydm')
		.setTitle('Reply to a DM');

	const topic = new TextInputBuilder()
		.setCustomId('title')
		.setLabel('Judul')
		.setPlaceholder('Tuliskan judul seputar balasan untuk pesan ini.')
		.setRequired(true)
		.setMinLength(1)
		.setMaxLength(256)
		.setStyle(TextInputStyle.Short);
	const desc = new TextInputBuilder()
		.setCustomId('desc')
		.setLabel('Deskripsi')
		.setPlaceholder('Tuliskan deskripsi seputar balasan untuk pesan ini.')
		.setMinLength(1)
		.setMaxLength(2048)
		.setRequired(true)
		.setStyle(TextInputStyle.Paragraph);

	const firstActionRow = new ActionRowBuilder().addComponents(topic);
	const secondActionRow = new ActionRowBuilder().addComponents(desc);

	modal.addComponents([firstActionRow, secondActionRow]);

	await interaction.showModal(modal);
};