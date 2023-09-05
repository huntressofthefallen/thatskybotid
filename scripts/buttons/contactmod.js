const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async (interaction) => {
	const modal = new ModalBuilder()
		.setCustomId('contactmod')
		.setTitle('☎┊contact✧the✧mods');

	const id = new TextInputBuilder()
		.setCustomId('id')
		.setLabel('Discord ID/Username')
		.setRequired(false)
		.setPlaceholder('Salin dan tempel Discord ID atau Username.')
		.setMaxLength(256)
		.setStyle(TextInputStyle.Short);
	const topic = new TextInputBuilder()
		.setCustomId('topic')
		.setLabel('Topik')
		.setPlaceholder('Tulis topik dari masalah.')
		.setRequired(true)
		.setMinLength(1)
		.setMaxLength(256)
		.setStyle(TextInputStyle.Short);
	const desc = new TextInputBuilder()
		.setCustomId('desc')
		.setLabel('Deskripsi')
		.setPlaceholder('Berikan penjelasan seputar masalah.')
		.setMinLength(1)
		.setMaxLength(2048)
		.setRequired(true)
		.setStyle(TextInputStyle.Paragraph);
	const url = new TextInputBuilder()
		.setCustomId('url')
		.setLabel('Tangkapan Layar (dalam bentuk link, opsional)')
		.setPlaceholder('Unggah, salin, lalu tempel link nya di sini.')
		.setMaxLength(1024)
		.setRequired(false)
		.setStyle(TextInputStyle.Paragraph);

	const firstActionRow = new ActionRowBuilder().addComponents(id);
	const secondActionRow = new ActionRowBuilder().addComponents(topic);
	const thirdActionRow = new ActionRowBuilder().addComponents(desc);
	const fourthActionRow = new ActionRowBuilder().addComponents(url);

	modal.addComponents([firstActionRow, secondActionRow, thirdActionRow, fourthActionRow]);

	await interaction.showModal(modal);
};