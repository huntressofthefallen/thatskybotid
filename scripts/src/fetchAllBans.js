const errorHandler = require('./errorHandler');

/**
 *
 * @param {import('discord.js').Guild} guild
 * @returns
 */
module.exports = async (guild) => {
	const bans = new Map();
	let startId = null;
	let hasMore = true;

	do {
		const batch = await guild.bans.fetch({ limit: 1000, after: startId }).catch(err => errorHandler(err));

		if (!batch.size) {
			hasMore = false;
		}
		else {
			batch.forEach((ban) => {
				bans.set(ban.user.id, ban);
				startId = ban.user.id;
			});
		}
	} while (hasMore);

	return bans;
};