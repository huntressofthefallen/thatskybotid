const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');

/**
 * Perform the next escalation step based on the user's recent infractions.
 * @param {import('discord.js').UserContextMenuCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the ban action.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	const user = await interaction.targetUser.fetch().catch(err => console.error(err.message));

	const embed = embedBuilder({
		client: interaction.client,
		user,
		title: 'User Report',
		description: `${user.tag} (<@${user.id}>) has been reported by ${interaction.user.tag} (<@${interaction.user.id}>).`,
		fields: [
			{ name: 'Reason', value: 'Profil yang Melanggar Peraturan', inline: false },
		],
		image: user.displayAvatarURL(),
	});

	const logChannel = await interaction.guild.channels.fetch('1016584787634442300').catch(err => console.error(err.message));
	await logChannel.send({ embeds: [embed], components: modActionRowBuilder() }).catch(err => console.error(err.message));

	await interaction.editReply({ content: 'Laporan darimu telah kami terima! Karena alasan privasi dan keamanan kami tidak dapat memberitahu tindakan yang telah kami lakukan atas laporan darimu. Terima kasih atas dukungan dan laporan darimu untuk menjadikan server Sky: Anak-Anak Cahaya lebih baik!', ephemeral: options.hidden }).catch(err => console.error(err.message));
};