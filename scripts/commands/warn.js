const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const userActionRowBuilder = require('../builders/userActionRow');
const { log } = require('../../database/lib/s');
const errorHandler = require('../src/errorHandler');

/**
 * Handles the interaction to warn a user.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	// Fetch the user and member objects from the interaction
	let user, reason;
	if (interaction.isChatInputCommand()) {
		user = await interaction.options.getUser('user').fetch().catch(err => errorHandler(err));
		reason = interaction.options.getString('reason');
	}
	else if (interaction.isMessageContextMenuCommand()) {
		await interaction.targetMessage.fetch().catch(err => errorHandler(err));
		user = await interaction.targetMessage.author.fetch().catch(err => errorHandler(err));
		reason = options.reason;
	}

	let dmStatus = false;
	const actionStatus = false;

	// Create the embed to be sent to the user via DM
	const dmEmbed = embedBuilder({
		client: interaction.client,
		user,
		title: `Halo ${user.username},`,
		description: `Kamu mendapatkan peringatan dari server ${interaction.guild.name} dengan alasan **__${reason}__**\n\nKami mengutamakan keamanan dan kenyamanan para pemain, mohon membaca kembali peraturan di server discord kami sebelum bergabung kembali bersama para pemain lainnya.`,
	});

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client: interaction.client,
		user,
		title: 'Warning Log',
		description: `${user.username} has been warned.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.username, inline: false },
		],
	});

	// Send the DM to the User
	await user.send({ embeds: [dmEmbed], components: userActionRowBuilder() }).then(() => { dmStatus = true; }).catch(err => errorHandler(err));

	// Send the log embed to the log channel
	const logChannel = await interaction.guild.channels.fetch('1016584900444430417').catch(err => errorHandler(err));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => errorHandler(err));

	// Edit the interaction reply with the log embed
	await interaction.editReply({ embeds: [logEmbed], ephemeral: options.hidden }).catch(err => errorHandler(err));

	// Create the log data object
	const logData = {
		guildId: interaction.guild.id,
		guildName: interaction.guild.name,
		channelId: interaction.channel.id,
		channelName: interaction.channel.name,
		userId: user.id,
		userTag: user.username,
		modId: interaction.user.id,
		modTag: interaction.user.username,
		action: 'warning',
		reason,
		dmStatus,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => errorHandler(err));
};

// Credits: Huntress of the Fallen