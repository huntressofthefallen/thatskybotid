const embedBuilder = require('../builders/embed');

/**
	 * Convert the input date to a date object in the specified timezone.
	 * @param {string} date - The input date string.
	 * @param {string} timeZone - The desired timezone.
	 * @returns {Date} - The date object in the specified timezone.
	 */
const getDateInTimeZone = (date, timeZone) => {
	const utcDate = new Date(date);
	const tzDate = new Date(utcDate.toLocaleString('en-US', { timeZone }));
	const offset = utcDate.getTime() - tzDate.getTime();
	return new Date(utcDate.getTime() + offset);
};

/**
 * Recursively updates the interaction reply with the event status based on the current time.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 * @param {Date} tsdatestart - The start date of the event.
 * @param {Date} tsdateend - The end date of the event.
 */
async function looping(interaction, options, tsdatestart, tsdateend) {
	const today = new Date().getTime();

	if (today > tsdateend.getTime()) {
		const tsstart = new Date(tsdatestart.getTime() + 2 * 60 * 60 * 1000);
		const tsend = new Date(tsdateend.getTime() + 2 * 60 * 60 * 1000);
		looping(interaction, options, tsstart, tsend);
	}
	else if (today > tsdatestart.getTime()) {
		const embed = embedBuilder({
			client: interaction.client,
			user: interaction.user,
			title: 'Geyser yang Tercemar',
			description: `Geyser yang Tercemar telah hadir di Pulau Tempat Suci di Padang Rumput Siang! Kunjungi Geyser ini sebelum <t:${tsdateend.getTime() / 1000}:t>. (<t:${tsdateend.getTime() / 1000}:R>)`,
		});

		await interaction.editReply({ embeds: [embed], ephemeral: options.hidden }).catch(err => console.error(err));
		return;
	}
	else {
		const embed = embedBuilder({
			client: interaction.client,
			user: interaction.user,
			title: 'Geyser yang Tercemar',
			description: `Geyser yang Tercemar selanjutnya akan hadir pada <t:${tsdatestart.getTime() / 1000}:t> hingga <t:${tsdateend.getTime() / 1000}:t>. (<t:${tsdatestart.getTime() / 1000}:R>)\n\nCatat waktunya dan jangan sampai ketinggalan kesempatan untuk membersihkan kegelapan!`,
		});

		await interaction.editReply({ embeds: [embed], ephemeral: options.hidden }).catch(err => console.error(err));
		return;
	}
}

/**
 * Handles the interaction to display information about the "Geyser yang Tercemar" event.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	const tsstartdate = 'March 28, 2023 00:00:00';
	const tsenddate = 'March 28, 2023 00:15:00';

	const tsstart = getDateInTimeZone(tsstartdate, 'America/Los_Angeles');
	const tsend = getDateInTimeZone(tsenddate, 'America/Los_Angeles');

	looping(interaction, options, tsstart, tsend);
};