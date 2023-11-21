const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const userActionRowBuilder = require('../builders/userActionRow');
const { log } = require('../../database/lib/s');
const errorHandler = require('../src/errorHandler');

/**
 * Handles the interaction to display the infraction log.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	const _id = interaction.options.getString('_id');
	const reason = interaction.options.getString('reason');

	const logEmbed = embedBuilder({
		client: interaction.client,
		user: interaction.user,
		title: 'Unwarn Log',
		description: `${interaction.user.username} has been unwarned. ${_id} has been removed. Reason: ${reason}`,
	});

	// Delete the log data on the database
	try {
		const data = await log.findOne({ _id, action: 'warning' });
		await log.deleteOne({ _id, action: 'warning' });

		// Send the DM to the User
		const user = await interaction.client.users.fetch(data.userId);

		// Create the embed to be sent to the user via DM
		const dmEmbed = embedBuilder({
			client: interaction.client,
			user,
			title: `Halo ${user.username},`,
			description: `Peringatan untukmu dari server ${interaction.guild.name} telah dihapuskan dengan alasan **__${reason}__**\n\nPerlu diingat bahwa kami mengutamakan keamanan dan kenyamanan para pemain, mohon membaca kembali peraturan di server discord kami sebelum bergabung kembali bersama para pemain lainnya.`,
		});

		await user.send({ embeds: [dmEmbed], components: userActionRowBuilder() });

		// Send the log embed to the log channel
		const logChannel = await interaction.guild.channels.fetch('1016584900444430417');
		await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() });

		await interaction.editReply({ embeds: [logEmbed], ephemeral: options.hidden });
	}
	catch (err) {
		await interaction.editReply({ content: err.message, ephemeral: options.hidden }).catch(err => errorHandler(err));
		console.error(err.message);
	}

};

// Credits: Huntress of the Fallen