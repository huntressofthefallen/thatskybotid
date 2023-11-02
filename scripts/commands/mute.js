const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const userActionRowBuilder = require('../builders/userActionRow');
const { log } = require('../../database/lib/s');
const conversionFactors = {
	'1h': 60 * 60 * 1000,
	'8h': 8 * 60 * 60 * 1000,
	'1d': 24 * 60 * 60 * 1000,
	'2d': 2 * 24 * 60 * 60 * 1000,
	'3d': 3 * 24 * 60 * 60 * 1000,
	'7d': 7 * 24 * 60 * 60 * 1000,
};

/**
 * Handles the interaction to mute a user.
 * @param {import('discord.js').BaseInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	// Fetch the user and member objects from the interaction
	let user, member, reason, length;
	if (interaction.isChatInputCommand()) {
		user = await interaction.options.getUser('user').fetch().catch(err => console.error(err.message));
		member = await interaction.options.getMember('user').fetch().catch(err => console.error(err.message));
		reason = interaction.options.getString('reason');
		length = interaction.options.getString('length') || options.duration;
	}
	else if (interaction.isMessageContextMenuCommand()) {
		user = interaction.targetMessage.author;
		member = interaction.targetMessage.member;
		reason = options.reason;
		length = options.duration;
	}

	const timeoutMiliseconds = conversionFactors[length];
	let dmStatus = false;
	let actionStatus = false;

	// Create the embed to be sent to the user via DM
	const dmEmbed = embedBuilder({
		client: interaction.client,
		user: user,
		title: `Halo ${user.username},`,
		description: `Kamu telah dimute dari ${interaction.guild.name} dengan alasan ${interaction.options.getString('reason')}\n\nKami mengutamakan keamanan dan kenyamanan para pemain, mohon membaca kembali peraturan di server discord kami sebelum bergabung kembali bersama para pemain lainnya.`,
	});

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client: interaction.client,
		user: user,
		title: 'Mute Log',
		description: `${user.tag} has been muted.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.tag, inline: false },
			{ name: 'Mute Length', value: length, inline: false },
		],
	});

	// Send the DM to the User
	await user.send({ embeds: [dmEmbed], components: userActionRowBuilder() }).then(() => { dmStatus = true; }).catch(err => console.error(err.message));

	// Check if the member is moderatable and perform the timeout action
	if (member.moderatable) {
		try {
			await member.timeout(timeoutMiliseconds, `${reason}`);
			actionStatus = true;
		}
		catch (err) {
			console.error(err.message);
		}
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
		action: 'mute',
		reason,
		length,
		dmStatus,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => console.error(err.message));
};

// Credits: Huntress of the Fallen