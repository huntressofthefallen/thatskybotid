const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const userActionRowBuilder = require('../builders/userActionRow');

/**
 * Perform the next escalation step based on the user's recent infractions.
 * @param {import('discord.js').MessageContextMenuCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the ban action.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	const message = await interaction.targetMessage.fetch().catch(err => console.error(err.message));

	const embed = embedBuilder({
		client: interaction.client,
		user: interaction.user,
		title: 'Message Report',
		description: `${message.author.tag} (<@${message.author.id}>)'s message has been reported by ${interaction.user.tag}.`,
		fields: [
			{ name: 'Reason', value: 'Mengirimkan Pesan yang Melanggar Peraturan', inline: false },
			{ name: 'Message Content', value: `-${message.content.slice(0, 1000)}`, inline: false },
			{ name: 'Message URL', value: `[Click Here to go to the Message](${message.url})`, inline: false },
		],
	});

	const logChannel = await interaction.guild.channels.fetch('1016584787634442300').catch(err => console.error(err.message));
	await logChannel.send({ embeds: [embed], components: modActionRowBuilder() }).catch(err => console.error(err.message));

	await interaction.editReply({ content: 'Laporan darimu telah kami terima! Karena alasan privasi dan keamanan kami tidak dapat memberitahu tindakan yang telah kami lakukan atas laporan darimu. Terima kasih atas dukungan dan laporan darimu untuk menjadikan server Sky: Anak-Anak Cahaya lebih baik!', components: userActionRowBuilder(), ephemeral: options.hidden }).catch(err => console.error(err.message));
};