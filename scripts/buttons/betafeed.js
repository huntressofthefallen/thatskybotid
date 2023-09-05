const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async (interaction) => {
	const modal = new ModalBuilder()
		.setCustomId('betafeed')
		.setTitle('📮┊beta✧feedback');

	const topic = new TextInputBuilder()
		.setCustomId('topic')
		.setLabel('Topik')
		.setPlaceholder('Tuliskan topik dari kritik dan saranmu.')
		.setRequired(true)
		.setMinLength(1)
		.setMaxLength(256)
		.setStyle(TextInputStyle.Short);
	const desc = new TextInputBuilder()
		.setCustomId('desc')
		.setLabel('Deskripsi')
		.setPlaceholder('Berikan penjelasan seputar kritik dan saranmu.')
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

	const firstActionRow = new ActionRowBuilder().addComponents(topic);
	const secondActionRow = new ActionRowBuilder().addComponents(desc);
	const thirdActionRow = new ActionRowBuilder().addComponents(url);

	modal.addComponents([firstActionRow, secondActionRow, thirdActionRow]);

	await interaction.showModal(modal);
};