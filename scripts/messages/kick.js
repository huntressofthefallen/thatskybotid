const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const { log } = require('../../database/lib/s');

/**
 * Sends a ban message to a user, ban the user, logs the ban, and saves the log data to the database.
 * @module kickUser
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
		description: `Kamu telah dikeluarkan dari ${message.guild.name} dengan alasan ${reason}\n\nKami mengutamakan keamanan dan kenyamanan para pemain, mohon membaca kembali peraturan di server discord kami sebelum bergabung kembali bersama kami.`,
	});

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client,
		user,
		title: 'Kick Log',
		description: `${user.tag} has been banned.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: 'thatskybotid', inline: false },
			{ name: 'Content', value: `${message.content?.substring(0, 1000)}`, inline: false },
			{ name: 'Channel', value: `<#${message.channel.id}>`, inline: false },
		],
	});

	// Send the DM to the User
	await user.send({ embeds: [dmEmbed] }).then(() => { dmStatus = true; }).catch(err => console.error(err.message));

	// Check if the member is kickable and perform the kick action
	if (member.kickable) {
		try {
			if (member.moderatable) {
				await member.timeout(7 * 24 * 60 * 60 * 1000, `${reason}`).catch(err => console.error(err.message));
			}
			await member.kick({ reason: reason });
			actionStatus = true;
		}
		catch (err) {
			console.error(err.message);
		}
	}

	// Send the log embed to the log channel
	const logChannel = await message.guild.channels.fetch('1027205248663687249').catch(err => console.error(err.message));
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
		action: 'kick',
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