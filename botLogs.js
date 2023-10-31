const { Events, AuditLogEvent, ChannelType } = require('discord.js');

/**
 * Sets up event listeners for logging various actions in the specified guild.
 * @param {import('discord.js').Client} client - The Discord.js client instance.
 */
module.exports = async (client) => {
	const idGuild = await client.guilds.fetch('1009644872065613864').catch(err => console.error(err.message));
	const logChannel = await idGuild.channels.fetch('1021379064763785266').catch(err => console.error(err.message));
	await idGuild.members.fetch().catch(err => console.error(err.message));

	client.on(Events.MessageDelete, async (message) => {
		if (message.channel.type != ChannelType.DM && message.guild.id == '1009644872065613864') {
			await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🗑️ Message ${message.id} in ${message.channel} has been removed.\n**Content:**${message.content?.substring(0, 1500)}` }).catch(err => console.error(err.message));
		}
	});

	client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
		if (newMessage.partial) {
			await newMessage.fetch().catch(err => console.error(err.message));
		}

		if (newMessage.channel.type != ChannelType.DM) {
			if (newMessage.guild.id == '1009644872065613864' && !newMessage.author.bot && oldMessage.content != newMessage.content) {
				if (newMessage.reference) {
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ✏️ Message ${newMessage.id} by ${newMessage.author.tag} (\`${newMessage.author.id}\`) in ${newMessage.channel} has been edited.\n**In reply to:** https://discord.com/channels${newMessage.reference.guildId}/${newMessage.reference.channelId}/${newMessage.reference.messageId}\n**Old:** ${oldMessage.content?.substring(0, 1000)}\n**New:** ${newMessage.content?.substring(0, 1000)}` }).catch(err => console.error(err.message));
				}
				else {
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ✏️ Message ${newMessage.id} by ${newMessage.author.tag} (\`${newMessage.author.id}\`) in ${newMessage.channel} has been edited.\n**Old:** ${oldMessage.content?.substring(0, 1000)}\n**New:** ${newMessage.content?.substring(0, 1000)}` }).catch(err => console.error(err.message));
				}
			}
		}
	});

	client.on(Events.GuildMemberAdd, async (member) => {
		if (member.partial) {
			await member.fetch().catch(err => console.error(err.message));
		}
		if (member.user.partial) {
			await member.user.fetch().catch(err => console.error(err.message));
		}

		if (member.guild.id == '1009644872065613864') {
			await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 👋📥 ${member.user.tag} (\`${member.user.id}\`) has joined, account created <t:${Math.round(member.user.createdTimestamp / 1000)}:R>` }).catch(err => console.error(err.message));
		}
	});

	client.on(Events.GuildMemberRemove, async (member) => {
		if (member.guild.id == '1009644872065613864') {
			// Get the audit logs for member kicks
			const auditLogs = await member.guild.fetchAuditLogs({ limit: 1 });
			const latestLog = auditLogs.entries.first();

			if (latestLog.target.id === member.id) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 👋📤 ${member.user?.tag} (\`${member.user.id}\`) has been kicked by ${latestLog.executor.tag} (\`${latestLog.executor.id}\`)` }).catch(err => console.error(err.message));
			}
			else {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 👋📤 ${member.user?.tag} (\`${member.user.id}\`) has left the server` }).catch(err => console.error(err.message));
			}
		}
	});

	client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
		if (newMember.partial) {
			await newMember.fetch().catch(err => console.error(err.message));
		}

		if (newMember.guild.id == '1009644872065613864') {
			if (newMember.nickname != oldMember.nickname) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🏷️ ${newMember.user.tag} (\`${newMember.user.id}\`) has changed nickname from \`${oldMember.nickname}\` to \`${newMember.nickname}\`` }).catch(err => console.error(err.message));
			}
			if (newMember.user.tag != oldMember.user.tag) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🏷️ ${newMember.user.tag} (\`${newMember.user.id}\`) has changed user tag (username#discriminator) from \`${oldMember.user?.tag}\` to \`${newMember.user.tag}\`` }).catch(err => console.error(err.message));
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
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ⚙️ The \`${addedRole.name}\` role was added to ${newMember.user.tag} (\`${newMember.user.id}\`) by ${latestLog.executor.tag} (\`${latestLog.executor.id}\`)` }).catch(err => console.error(err.message));
				}

				if (removedRole) {
					await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] ⚙️ The \`${removedRole.name}\` role was removed from ${newMember.user.tag} (\`${newMember.user.id}\`) by ${latestLog.executor.tag} (\`${latestLog.executor.id}\`)` }).catch(err => console.error(err.message));
				}
			}

			// Check if a member started or stopped boosting the server
			const oldBoost = oldMember.premiumSince;
			const newBoost = newMember.premiumSince;

			if (!oldBoost && newBoost) {
				await logChannel.send(`[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🚀 ${newMember.user.tag} (\`${newMember.user.id}\`) started boosting the server.`).catch(err => console.error(err.message));
			}
			else if (oldBoost && !newBoost) {
				await logChannel.send(`[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🚀 ${newMember.user.tag} (\`${newMember.user.id}\`) stopped boosting the server.`).catch(err => console.error(err.message));
			}
		}
	});

	client.on(Events.GuildBanAdd, async (ban) => {
		if (ban.partial) {
			await ban.fetch().catch(err => console.error(err.message));
		}

		if (ban.guild.id == '1009644872065613864') {
			// Get the audit logs for member ban adds
			const auditLogs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 });
			const latestLog = auditLogs.entries.first();

			if (latestLog.target.id === ban.user.id) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.tag} (\`${ban.user.id}\`) has been banned in ${ban.guild.name} by ${latestLog.executor.tag} (\`${latestLog.executor.id}\`)` }).catch(err => console.error(err.message));
			}
			else {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.tag} (\`${ban.user.id}\`) has been banned in ${ban.guild.name}` }).catch(err => console.error(err.message));
			}
		}
	});

	client.on(Events.GuildBanRemove, async (ban) => {
		if (ban.partial) {
			await ban.fetch().catch(err => console.error(err.message));
		}

		if (ban.guild.id == '1009644872065613864') {
			// Get the audit logs for member ban adds
			const auditLogs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, limit: 1 });
			const latestLog = auditLogs.entries.first();

			if (latestLog.target.id === ban.user.id) {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.tag} (\`${ban.user.id}\`) has been unbanned in ${ban.guild.name} by ${latestLog.executor.tag} (\`${latestLog.executor.id}\`)` }).catch(err => console.error(err.message));
			}
			else {
				await logChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${ban.user?.tag} (\`${ban.user.id}\`) has been unbanned in ${ban.guild.name}` }).catch(err => console.error(err.message));
			}
		}
	});
};