const embedBuilder = require('./scripts/builders/embed');
const { log } = require('./database/lib/s');
const { AuditLogEvent } = require('discord.js');
const fetchAllBans = require('./scripts/src/fetchAllBans');

/**
 * This function checks for pending members and banned users in the guild.
 * It assigns or removes a role based on the member's status.
 * It also bans members who are banned in the global guild.
 *
 * @param {import('discord.js').Client} client - The Discord client
 */
module.exports = async (client) => {
	const idGuild = await client.guilds.fetch('1009644872065613864').catch(err => console.error(err.message));
	const childOfLightRole = await idGuild.roles.fetch('1009736934765113415').catch(err => console.error(err.message));
	const idMembers = await idGuild.members.fetch().catch(err => console.error(err.message));
	let num = 0;
	let count = 0;

	// Iterate through members
	idMembers.forEach(async member => {
		count++;
		if (!member.pending && !member.roles.cache.has('1009736934765113415')) {
			num++;
			setTimeout(async () => {
				await member.roles.add(childOfLightRole).catch(err => console.error(err.message));
				console.log(`S${count}. [add] => ${member.user.tag} - Pending: ${member.pending} - hasRole: ${member.roles.cache.has('1009736934765113415')}`);
			}, 1000 * num);
		}
		else if (member.pending && member.roles.cache.has('1009736934765113415')) {
			num++;
			setTimeout(async () => {
				await member.roles.remove(childOfLightRole).catch(err => console.error(err.message));
				console.log(`S${count}. [remove] => ${member.user.tag} - Pending: ${member.pending} - hasRole: ${member.roles.cache.has('1009736934765113415')}`);
			}, 1000 * num);
		}
	});

	let numban = 0;

	// Check Banned Users
	const globalGuild = await client.guilds.fetch('575762611111592007').catch(err => console.error(err.message));
	const idGuildBans = await fetchAllBans(idGuild).catch(err => console.error(err.message));
	const globalGuildBans = await fetchAllBans(globalGuild).catch(err => console.error(err.message));

	idMembers.forEach(async member => {
		globalGuildBans.forEach(async guildBan => {
			if (member.user.id === guildBan.user.id) {
				numban++;
				console.log(`S${numban}. ${member.user.id} - ${member.user.tag} - ${guildBan.reason}`);
				setTimeout(async () => {
					let actionStatus = false;
					let dmStatus = false;

					const dmEmbed = embedBuilder({
						client,
						user: member.user,
						title: `Halo ${member.user.username},`,
						description: `Kamu telah diban dari ${member.guild.name} dengan alasan telah diban dari Server Global dengan alasan __${guildBan.reason}__\n\nUntuk mengajukan banding atas ban yang kamu terima, kamu dapat menghubungi kami melalui server berikut ini:\nhttps://bit.ly/SkyDiscordBanReview`,
					});
					const logEmbed = embedBuilder({
						client,
						user: member.user,
						title: 'Global Auto Ban Log',
						description: `${member.user.tag} has been banned.`,
						fields: [
							{ name: 'Moderator', value: `${client.user.tag}`, inline: false },
							{ name: 'Reason', value: `Global: ${guildBan.reason}`, inline: false },
						],
					});

					await member.send({ embeds: [dmEmbed] }).then(() => { dmStatus = true; }).catch(err => console.error(err.message));

					try {
						await member.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: `Global Bans: ${guildBan.reason}` }).catch(err => console.error(err.message));
						actionStatus = true;
					}
					catch (err) {
						console.error(err.message);
					}

					const logChannel = await idGuild.channels.fetch('1016585021651427370').catch(err => console.error(err.message));
					await logChannel.send({ embeds: [logEmbed] }).catch(err => console.error(err.message));

					// Create the log data object
					const logData = {
						guildId: idGuild.id,
						guildName: idGuild.name,
						channelId: '575762611111592007',
						channelName: 'Sky: Children of the Light',
						userId: member.id,
						userTag: member.tag,
						modId: client.user.id,
						modTag: client.user.tag,
						action: 'ban',
						reason: guildBan.reason,
						dmStatus,
						actionStatus,
					};

					// Save the log data to the database
					await log.create(logData).catch(err => console.error(err.message));
				}, 5000 * numban);
			}
		});
	});

	let unbanned = [];

	idGuildBans.forEach(async idGuildBan => {
		let stillBanned = false;
		globalGuildBans.forEach(async guildBan => {
			if (idGuildBan.user.id === guildBan.user.id) {
				stillBanned = true;
			}
		});

		if (!stillBanned) {
			const auditLogs = await globalGuild.fetchAuditLogs({ type: AuditLogEvent.MemberBanRemove, user: idGuildBan.user, limit: 1 }).catch(err => console.error(err.message));
			const latestLog = auditLogs.entries.first();

			unbanned.push({ id: idGuildBan.user.id, reason: `Global Unban: ${latestLog?.reason}`, tag: idGuildBan.user.username, user: idGuildBan.user })
		}
	});

	unbanned.forEach(async (unban, i) => {
		setTimeout(async () => {
			await idGuild.bans.remove(unban.id, { reason: unban.reason }).catch(err => console.error(err));

			const logEmbed = embedBuilder({
				client,
				user: unban.user,
				title: 'Global Auto Unban Log',
				description: `${unban.tag} has been unbanned.`,
				fields: [
					{ name: 'Moderator', value: `${client.user.tag}`, inline: false },
					{ name: 'Reason', value: `${unban.reason}`, inline: false },
				],
			});

			const logChannel = await idGuild.channels.fetch('1016585021651427370').catch(err => console.error(err.message));
			await logChannel.send({ embeds: [logEmbed] }).catch(err => console.error(err.message));

			// Create the log data object
			const logData = {
				guildId: idGuild.id,
				guildName: idGuild.name,
				channelId: '575762611111592007',
				channelName: 'Sky: Children of the Light',
				userId: unban.id,
				userTag: unban.tag,
				modId: client.user.id,
				modTag: client.user.tag,
				action: 'unban',
				reason: guildBan.reason,
				dmStatus,
				actionStatus,
			};

			// Save the log data to the database
			await log.create(logData).catch(err => console.error(err.message));
		}, 5000 * i);
	});
};