const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (interaction) => {
	const title = interaction.fields.getTextInputValue('title');
	const desc = interaction.fields.getTextInputValue('desc');

	const replybtn = new ButtonBuilder()
		.setCustomId('replydm')
		.setLabel('Click to Reply')
		.setEmoji('💬')
		.setStyle(ButtonStyle.Primary);

	const replyact = new ActionRowBuilder()
		.addComponents([replybtn]);

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
		.setFooter({ text: `${interaction.channel.id}-${interaction.message.id}`, iconURL: interaction.user.displayAvatarURL() });

	await interaction.client.users.fetch(interaction.message.embeds[0].footer.text).then(async u => {
		await interaction.message.edit({ content: `${interaction.user.tag} replied to this message.`, components: [] }).catch(err => console.error(err.message));
		await interaction.message.reply({ embeds: [embed] }).then(async m => {
			embed.setFooter({ text: `${interaction.channel.id}-${m.id}`, iconURL: interaction.user.displayAvatarURL() });
			await u.send({ embeds: [embed], components: [replyact] }).catch(err => console.error(err.message));
			await interaction.editReply({ content: 'Message Sent!', ephemeral: true }).catch(err => console.error(err.message));
		}).catch(err => console.error(err.message));
	}).catch(err => console.error(err.message));
};