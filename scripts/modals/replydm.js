const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction) => {
	const title = interaction.fields.getTextInputValue('title');
	const desc = interaction.fields.getTextInputValue('desc');

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
		.setTitle(title)
		.setDescription(desc)
		.addFields(
			{ name: 'Author', value: `${interaction.user.tag}`, inline: false },
		)
		.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid', iconURL: interaction.client.user.displayAvatarURL() })
		.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
		.setColor('Random')
		.setTimestamp()
		.setFooter({ text: interaction.user.id, iconURL: interaction.user.displayAvatarURL() });

	const args = interaction.message.embeds[0].footer.text.trim().split(/-/);

	await interaction.client.channels.fetch(args[0]).then(async ch => {
		await ch.messages.fetch(args[1]).then(async m => {
			await m.reply({ embeds: [embed], components: [replyact] }).catch(err => console.error(err));
			await interaction.message.edit({ content: 'Kamu telah membalas pesan ini, mohon tunggu balasan dari kami.', components: [] }).catch(err => console.error(err));
			await interaction.editReply({ content: 'Pesan terkirim, terima kasih telah membalas pesan kami. Mohon tunggu balasan dari kami selanjutnya.', ephemeral: true }).catch(err => console.error(err));
		}).catch(err => console.error(err));
	}).catch(err => console.error(err));
};