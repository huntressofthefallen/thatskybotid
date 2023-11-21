const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const { log } = require('../../database/lib/s');

/**
 * Handles the interaction to unmute a user.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	// Fetch the user and member objects from the interaction
	const user = await interaction.options.getUser('user').fetch().catch(err => console.error(err.message));
	const member = await interaction.options.getMember('user').fetch().catch(err => console.error(err.message));
	const reason = interaction.options.getString('reason');
	let actionStatus = false;

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client: interaction.client,
		user: user,
		title: 'Unmute Log',
		description: `${user.tag} has been unmuted.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.tag, inline: false },
		],
	});

	// Try to perform the timeout action
	try {
		await member.timeout(null, `${reason}`);
		actionStatus = true;
	}
	catch (err) {
		console.error(err.message);
	}

	// Send the log embed to the log channel
	const logChannel = await interaction.guild.channels.fetch('1016584981147045979').catch(err => console.error(err.message));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => console.error(err.message));

	// Edit the interaction reply with the log embed
	await interaction.editReply({ embeds: [logEmbed], ephemeral: options.hidden }).catch(err => console.error(err.message));

	// Create the log data object
	const logData = {
		guildId: interaction.guild.id,
		guildName: interaction.guild.name,
		channelId: interaction.channel.id,
		channelName: interaction.channel.name,
		userId: user.id,
		userTag: user.tag,
		modId: interaction.user.id,
		modTag: interaction.user.tag,
		action: 'unmute',
		reason,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => console.error(err.message));
};

// Credits: Huntress of the Fallen