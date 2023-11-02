const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const userActionRowBuilder = require('../builders/userActionRow');
const { log } = require('../../database/lib/s');

/**
 * Sends a ban message to a user, ban the user, logs the ban, and saves the log data to the database.
 * @module banUser
 * @param {import("discord.js").Message} message - The message object that triggered the command.
 * @param {import("discord.js").Client} client - The client object that triggered the command.
 * @param {string} reason - The reason for the bans.
 */
module.exports = async (message, client, reason) => {
	// Fetch the user and member objects from the message
	const user = message.author;
	const member = message.member;

	let dmStatus = false;
	let actionStatus = false;

	// Create the embed to be sent to the user via DM
	const dmEmbed = embedBuilder({
		client,
		user,
		title: `Halo ${user.username},`,
		description: `Kamu telah diban dari ${message.guild.name} dengan alasan ${reason}\n\nUntuk mengajukan banding atas ban yang kamu terima, kamu dapat menghubungi kami melalui server berikut ini:\nhttps://bit.ly/SkyDiscordBanReview`,
	});

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client,
		user,
		title: 'Ban Log',
		description: `${user.tag} has been banned.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: 'thatskybotid', inline: false },
			{ name: 'Content', value: `${message.content?.substring(0, 1000)}`, inline: false },
			{ name: 'Channel', value: `<#${message.channel.id}>`, inline: false },
		],
	});

	// Send the DM to the User
	await user.send({ embeds: [dmEmbed], components: userActionRowBuilder() }).then(() => { dmStatus = true; }).catch(err => console.error(err.message));

	// Check if the member is banable and perform the ban action
	if (member.banable) {
		try {
			await member.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: reason });
			actionStatus = true;
		}
		catch (err) {
			console.error(err.message);
		}
	}

	// Send the log embed to the log channel
	const logChannel = await message.guild.channels.fetch('1016585021651427370').catch(err => console.error(err.message));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => console.error(err.message));

	const attachmentUrls = [];
	if (message.attachments) {
		message.attachments.forEach(attachment => {
			attachmentUrls.push(attachment.url);
		});
	}

	// Create the log data object
	const logData = {
		guildId: message.guild.id,
		guildName: message.guild.name,
		channelId: message.channel.id,
		channelName: message.channel.name,
		userId: user.id,
		userTag: user.tag,
		modId: client.user.id,
		modTag: client.user.tag,
		action: 'ban',
		reason,
		dmStatus,
		actionStatus,
		messageContent: message.content,
		attachmentUrls,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => console.error(err.message));
};

// Credits: Huntress of the Fallen