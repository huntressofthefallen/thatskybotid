const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction) => {
	const id = interaction.fields.getTextInputValue('id');
	const topic = interaction.fields.getTextInputValue('topic');
	const desc = interaction.fields.getTextInputValue('desc');
	const url = interaction.fields.getTextInputValue('url');

	const replybtn = new ButtonBuilder()
		.setCustomId('replych')
		.setLabel('Reply to the Message')
		.setEmoji('💬')
		.setStyle(ButtonStyle.Primary);

	const donebtn = new ButtonBuilder()
		.setCustomId('done')
		.setLabel('Set as Done')
		.setEmoji('✅')
		.setStyle(ButtonStyle.Success);

	const replyact = new ActionRowBuilder()
		.addComponents([replybtn, donebtn]);

	const embed = new EmbedBuilder()
		.setTitle(topic)
		.setDescription(desc)
		.addFields(
			{ name: 'Discord ID/Username', value: `Discord: ${id}`, inline: false },
			{ name: 'Screenshot URL', value: `URL: ${url}`, inline: false },
			{ name: 'Author', value: `${interaction.user.tag}`, inline: false },
		)
		.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid', iconURL: interaction.client.user.displayAvatarURL() })
		.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
		.setColor('Random')
		.setTimestamp()
		.setFooter({ text: interaction.user.id, iconURL: interaction.user.displayAvatarURL() });

	await interaction.guild.channels.fetch('1016584787634442300').then(async ch => {
		await ch.send({ embeds: [embed], components: [replyact] }).catch(err => console.error(err));
	}).catch(err => console.error(err));
	await interaction.editReply({ content: 'Terima kasih telah mengisi formulir untuk menghubungi moderator. Sebagai informasi, kami telah menerima pesanmu dan akan membalas pesanmu melalui DM jika kami memerlukan informasi tambahan.\n\nKami memintamu untuk mengizinkan Direct Message dari Server ini agar kami dapat menghubungi kamu melalui DM\nInfo Selengkapnya: https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-', ephemeral: true }).catch(err => console.error(err));
};