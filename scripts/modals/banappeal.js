const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const errorHandler = require('../src/errorHandler');

module.exports = async (interaction) => {
	const reason = interaction.fields.getTextInputValue('reason');
	const time = interaction.fields.getTextInputValue('time');
	const desc = interaction.fields.getTextInputValue('desc');
	const step = interaction.fields.getTextInputValue('step');
	const discordid = interaction.fields.getTextInputValue('discordid');

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
		.setTitle(`${interaction.user.username} (${interaction.user.id})`)
		.setDescription(desc)
		.addFields(
			{ name: 'Mengapa kamu dibanned?', value: reason, inline: false },
			{ name: 'Kapan kira-kira kamu dibanned?', value: time, inline: false },
			{ name: 'Apa langkah yang telah kamu ambil untuk memperbaiki penyebab dari banned tersebut?', value: step, inline: false },
			{ name: 'Discord ID', value: discordid, inline: false },
		)
		.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid', iconURL: interaction.client.user.displayAvatarURL() })
		.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
		.setColor('Random')
		.setTimestamp()
		.setFooter({ text: interaction.user.id, iconURL: interaction.user.displayAvatarURL() });

	await interaction.guild.channels.fetch('1031748268796944465').then(async ch => {
		await ch.send({ embeds: [embed], components: [replyact] }).catch(err => errorHandler(err));
	}).catch(err => errorHandler(err));
	await interaction.editReply({ content: 'Terima kasih telah mengisi formulir untuk mengajukan banding atas ban yang kamu dapatkan di server Sky: Children of the Light Indonesia. Sebagai informasi, kami telah menerima pesanmu dan akan menghubungi kamu melalui DM jika kami memerlukan informasi tambahan.\n\nKami memintamu untuk mengizinkan Direct Message dari Server ini agar kami dapat menghubungi kamu melalui DM\nInfo Selengkapnya: https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-\n\nKami tidak akan membalas pengajuan banding atas ban yang kamu dapatkan dalam game Sky, untuk pengajuan banding atas ban di dalam game kamu dapat menuju ke Dukungan Pemain Sky dalam game atau melalui link berikut: https://bit.ly/skygamecs', ephemeral: true }).catch(err => errorHandler(err));
};