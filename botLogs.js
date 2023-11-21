const { Events, AuditLogEvent, ChannelType } = require('discord.js');
const errorHandler = require('./scripts/src/errorHandler');

/**
 * Sets up event listeners for logging various actions in the specified guild.
 * @param {import('discord.js').Client} client - The Discord.js client instance.
 */
module.exports = async (client) => {
	const idGuild = await client.guilds.fetch('1009644872065613864').catch(err => errorHandler(err));
	const logChannel = await idGuild.channels.fetch('1021379064763785266').catch(err => errorHandler(err));
	await idGuild.members.fetch().catch(err => errorHandler(err));

	client.on(Events.MessageDelete, async (message) => {
		if (message.channel.type != ChannelType.DM && message.guild.id == '1009644872065613864') {
			await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🗑️ Message ${message.id} in ${message.channel} has been removed.\n**Content:**${message.content?.substring(0, 1500)}` }).catch(err => errorHandler(err));
		}
	});

	client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
		if (newMessage.partial) {
			await newMessage.fetch().catch(err => errorHandler(err));
		}

		if (newMessage.channel.type != ChannelType.DM) {
			if (newMessage.guild.id == '1009644872065613864' && !newMessage.author.bot && oldMessage.content != newMessage.content) {
				if (newMessage.reference) {
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ✏️ Message ${newMessage.id} by ${newMessage.author.username} (\`${newMessage.author.id}\`) in ${newMessage.channel} has been edited.\n**In reply to:** https://discord.com/channels${newMessage.reference.guildId}/${newMessage.reference.channelId}/${newMessage.reference.messageId}\n**Old:** ${oldMessage.content?.substring(0, 1000)}\n**New:** ${newMessage.content?.substring(0, 1000)}` }).catch(err => errorHandler(err));
				}
				else {
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ✏️ Message ${newMessage.id} by ${newMessage.author.username} (\`${newMessage.author.id}\`) in ${newMessage.channel} has been edited.\n**Old:** ${oldMessage.content?.substring(0, 1000)}\n**New:** ${newMessage.content?.substring(0, 1000)}` }).catch(err => errorHandler(err));
				}
			}
		}
	});

	client.on(Events.GuildMemberAdd, async (member) => {
		if (member.partial) {
			await member.fetch().catch(err => errorHandler(err));
		}
		if (member.user.partial) {
			await member.user.fetch().catch(err => errorHandler(err));
		}

		if (member.guild.id == '1009644872065613864') {
			await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 👋📥 ${member.user.username} (\`${member.user.id}\`) has joined, account created <t:${Math.round(member.user.createdTimestamp / 1000)}:R>` }).catch(err => errorHandler(err));
		}
	});

	client.on(Events.GuildMemberRemove, async (member) => {
		if (member.guild.id == '1009644872065613864') {
			// Get the audit logs for member kicks
			const auditLogs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
			const latestLog = auditLogs.entries.first();

			if (latestLog.target.id === member.id) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 👋📤 ${member.user?.username} (\`${member.user.id}\`) has been kicked by ${latestLog.executor.username} (\`${latestLog.executor.id}\`)` }).catch(err => errorHandler(err));
			}
			else {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 👋📤 ${member.user?.username} (\`${member.user.id}\`) has left the server` }).catch(err => errorHandler(err));
			}
		}
	});

	client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
		if (newMember.partial) {
			await newMember.fetch().catch(err => errorHandler(err));
		}

		if (newMember.guild.id == '1009644872065613864') {
			if (newMember.nickname != oldMember.nickname) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🏷️ ${newMember.user.username} (\`${newMember.user.id}\`) has changed nickname from \`${oldMember.nickname}\` to \`${newMember.nickname}\`` }).catch(err => errorHandler(err));
			}
			if (newMember.user.username != oldMember.user.username) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🏷️ ${newMember.user.username} (\`${newMember.user.id}\`) has changed user tag (username#discriminator) from \`${oldMember.user?.username}\` to \`${newMember.user.username}\`` }).catch(err => errorHandler(err));
			}

			// Get the roles before and after the update
			const oldRoles = oldMember.roles.cache;
			const newRoles = newMember.roles.cache;

			// Find the added or removed role
			const addedRole = newRoles.find(role => !oldRoles.has(role.id));
			const removedRole = oldRoles.find(role => !newRoles.has(role.id));

			// Get the audit logs for role updates
			const auditLogs = await oldMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate, limit: 1 });
			const latestLog = auditLogs.entries.first();

			if (latestLog.target.id === newMember.id) {
				if (addedRole) {
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ⚙️ The \`${addedRole.name}\` role was added to ${newMember.user.username} (\`${newMember.user.id}\`) by ${latestLog.executor.username} (\`${latestLog.executor.id}\`)` }).catch(err => errorHandler(err));
				}

				if (removedRole) {
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ⚙️ The \`${removedRole.name}\` role was removed from ${newMember.user.username} (\`${newMember.user.id}\`) by ${latestLog.executor.username} (\`${latestLog.executor.id}\`)` }).catch(err => errorHandler(err));
				}
			}

			// Check if a member started or stopped boosting the server
			const oldBoost = oldMember.premiumSince;
			const newBoost = newMember.premiumSince;

			if (!oldBoost && newBoost) {
				await logChannel.send(`[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🚀 ${newMember.user.username} (\`${newMember.user.id}\`) started boosting the server.`).catch(err => errorHandler(err));
			}
			else if (oldBoost && !newBoost) {
				await logChannel.send(`[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🚀 ${newMember.user.username} (\`${newMember.user.id}\`) stopped boosting the server.`).catch(err => errorHandler(err));
			}
		}
	});

	client.on(Events.GuildBanAdd, async (ban) => {
		if (ban.partial) {
			await ban.fetch().catch(err => errorHandler(err));
		}

		if (ban.guild.id == '1009644872065613864') {
			// Get the audit logs for member ban adds
			const auditLogs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 });
			const latestLog = auditLogs.entries.first();

			if (latestLog.target.id === ban.user.id) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.username} (\`${ban.user.id}\`) has been banned in ${ban.guild.name} by ${latestLog.executor.username} (\`${latestLog.executor.id}\`)` }).catch(err => errorHandler(err));
			}
			else {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.username} (\`${ban.user.id}\`) has been banned in ${ban.guild.name}` }).catch(err => errorHandler(err));
			}
		}
	});

	client.on(Events.GuildBanRemove, async (ban) => {
		if (ban.partial) {
			await ban.fetch().catch(err => errorHandler(err));
		}

		if (ban.guild.id == '1009644872065613864') {
			// Get the audit logs for member ban adds
			const auditLogs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 });
			const latestLog = auditLogs.entries.first();

			if (latestLog.target.id === ban.user.id) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.username} (\`${ban.user.id}\`) has been unbanned in ${ban.guild.name} by ${latestLog.executor.username} (\`${latestLog.executor.id}\`)` }).catch(err => errorHandler(err));
			}
			else {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.username} (\`${ban.user.id}\`) has been unbanned in ${ban.guild.name}` }).catch(err => errorHandler(err));
			}
		}
	});
};