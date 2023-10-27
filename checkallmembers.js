// const embedBuilder = require('./scripts/builders/embed');
// const { log } = require('../database/lib/s');

// async function fetchAllBans(guild) {
// 	const bans = new Map();
// 	let startId = null;
// 	let hasMore = true;

// 	do {
// 		const batch = await guild.bans.fetch({ limit: 1000, after: startId }).catch(console.error);

// 		if (!batch.size) {
// 			hasMore = false;
// 		}
// 		else {
// 			batch.forEach((ban) => {
// 				bans.set(ban.user.id, ban);
// 				startId = ban.user.id;
// 			});
// 		}
// 	} while (hasMore);

// 	return bans;
// }

/**
 * This function checks for pending members and banned users in the guild.
 * It assigns or removes a role based on the member's status.
 * It also bans members who are banned in the global guild.
 *
 * @param {import('discord.js').Client} client - The Discord client
 */
module.exports = async (client) => {
	const idGuild = await client.guilds.fetch('1009644872065613864').catch(console.error);
	const childOfLightRole = await idGuild.roles.fetch('1009736934765113415').catch(console.error);
	const idMembers = await idGuild.members.fetch().catch(console.error);
	let num = 0;
	let count = 0;

	// Iterate through members
	idMembers.forEach(async member => {
		count++;
		if (!member.pending && !member.roles.cache.has('1009736934765113415')) {
			num++;
			setTimeout(async () => {
				await member.roles.add(childOfLightRole).catch(console.error);
				console.log(`S${count}. [add] => ${member.user.tag} - Pending: ${member.pending} - hasRole: ${member.roles.cache.has('1009736934765113415')}`);
			}, 1000 * num);
		}
		else if (member.pending && member.roles.cache.has('1009736934765113415')) {
			num++;
			setTimeout(async () => {
				await member.roles.remove(childOfLightRole).catch(console.error);
				console.log(`S${count}. [remove] => ${member.user.tag} - Pending: ${member.pending} - hasRole: ${member.roles.cache.has('1009736934765113415')}`);
			}, 1000 * num);
		}
	});

	// let numban = 0;

	// Check Banned Users
	// const globalGuild = await client.guilds.fetch('575762611111592007').catch(console.error);
	// const idGuildBans = await fetchAllBans(idGuild).catch(console.error);
	// const globalGuildBans = await fetchAllBans(globalGuild).catch(console.error);

	// idMembers.forEach(async member => {
	// 	globalGuildBans.forEach(async guildBan => {
	// 		if (member.user.id === guildBan.user.id) {
	// 			numban++;
	// 			console.log(`S${numban}. ${member.user.id} - ${member.user.tag} - ${guildBan.reason}`);
	// 			setTimeout(async () => {
	// 				let actionStatus = false;
	// 				let dmStatus = false;

	// 				const dmEmbed = embedBuilder({
	// 					client,
	// 					user: member.user,
	// 					title: `Halo ${member.user.username},`,
	// 					description: `Kamu telah diban dari ${member.guild.name} dengan alasan telah diban dari Server Global dengan alasan __${guildBan.reason}__\n\nUntuk mengajukan banding atas ban yang kamu terima, kamu dapat menghubungi kami melalui server berikut ini:\nhttps://bit.ly/SkyDiscordBanReview`,
	// 				});
	// 				const logEmbed = embedBuilder({
	// 					client,
	// 					user: member.user,
	// 					title: 'Global Auto Ban Log',
	// 					description: `${member.user.tag} has been banned.`,
	// 					fields: [
	// 						{ name: 'Moderator', value: `${client.user.tag}`, inline: false },
	// 						{ name: 'Reason', value: `Global: ${guildBan.reason}`, inline: false },
	// 					],
	// 				});

	// 				await member.send({ embeds: [dmEmbed] }).then(() => { dmStatus = true; }).catch(console.error);

	// 				try {
	// 					await member.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: `Global Bans: ${guildBan.reason}` }).catch(console.error);
	// 					actionStatus = true;
	// 				}
	// 				catch (err) {
	// 					console.error(err);
	// 				}

	// 				const logChannel = await idGuild.channels.fetch('1016585021651427370').catch(console.error);
	// 				await logChannel.send({ embeds: [logEmbed] }).catch(console.error);

	// 				// Create the log data object
	// 				const logData = {
	// 					guildId: idGuild.id,
	// 					guildName: idGuild.name,
	// 					channelId: '575762611111592007',
	// 					channelName: 'Sky: Children of the Light',
	// 					userId: member.id,
	// 					userTag: member.tag,
	// 					modId: client.user.id,
	// 					modTag: client.user.tag,
	// 					action: 'ban',
	// 					reason: guildBan.reason,
	// 					dmStatus,
	// 					actionStatus,
	// 				};

	// 				// Save the log data to the database
	// 				await log.create(logData).catch(console.error);
	// 			}, 5000 * numban);
	// 		}
	// 	});
	// });

	// const banList = [];

	// globalGuildBans.forEach(globalBan => {
	// 	let isBanned = false;
	// 	idGuildBans.forEach(idBan => {
	// 		if (globalBan.user.id == idBan.user.id) {
	// 			isBanned = true;
	// 		}
	// 	});
	// 	if (!isBanned) {
	// 		banList.push(globalBan);
	// 	}
	// });

	// const banLogChannel = await idGuild.channels.fetch('1021379064763785266').catch(console.error);
	// banList.forEach(async (globalBanned, i) => {
	// 	setTimeout(async () => {
	// 		await idGuild.bans.create(globalBanned.user.id, { deleteMessageSeconds: 7 * 24 * 60 * 60, reason: `Global Bans: ${globalBanned.reason}` }).catch(console.error);
	// 		await banLogChannel.send({ content: `[<t:${Math.round(new Date().getTime() / 1000)}:R>] 🔨 ${globalBanned.user.id} has been banned with Reason: ${globalBanned.reason}` }).catch(err => console.error(err));
	// 		console.log(`S-Global Bans (${i + 1}/${banList.length}): ${globalBanned.user.id} - Reason: ${globalBanned.reason}`);
	// 	}, 5000 * i);
	// });
};