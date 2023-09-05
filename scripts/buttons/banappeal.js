const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = async (interaction) => {
	const modal = new ModalBuilder()
		.setCustomId('banappeal')
		.setTitle('☎┊Pengajuan Banding Ban Server Indonesia');

	const reason = new TextInputBuilder()
		.setCustomId('reason')
		.setLabel('Mengapa kamu dibanned?')
		.setRequired(true)
		.setMinLength(1)
		.setMaxLength(256)
		.setStyle(TextInputStyle.Short);
	const time = new TextInputBuilder()
		.setCustomId('time')
		.setLabel('Kapan kira-kira kamu dibanned?')
		.setRequired(true)
		.setMinLength(1)
		.setMaxLength(256)
		.setStyle(TextInputStyle.Short);
	const desc = new TextInputBuilder()
		.setCustomId('desc')
		.setLabel('Kenapa banned untukmu harus dicabut?')
		.setMinLength(1)
		.setMaxLength(2048)
		.setRequired(true)
		.setStyle(TextInputStyle.Paragraph);
	const step = new TextInputBuilder()
		.setCustomId('step')
		.setLabel('Apa langkah yang telah kamu ambil?')
		.setRequired(true)
		.setMinLength(1)
		.setMaxLength(1024)
		.setStyle(TextInputStyle.Paragraph);
	const discordid = new TextInputBuilder()
		.setCustomId('discordid')
		.setLabel('Berikan Discord ID untuk semua akun milikmu.')
		.setRequired(true)
		.setMinLength(1)
		.setMaxLength(512)
		.setStyle(TextInputStyle.Paragraph);

	const firstActionRow = new ActionRowBuilder().addComponents(reason);
	const secondActionRow = new ActionRowBuilder().addComponents(time);
	const thirdActionRow = new ActionRowBuilder().addComponents(desc);
	const fourthActionRow = new ActionRowBuilder().addComponents(step);
	const fifthActionRow = new ActionRowBuilder().addComponents(discordid);

	modal.addComponents([firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow]);

	await interaction.showModal(modal);
};