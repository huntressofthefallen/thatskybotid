const embedBuilder = require('../builders/embed');
const userActionRowBuilder = require('../builders/userActionRow');
const errorHandler = require('../src/errorHandler');

/**
 * Determines whether the given date falls within the Pacific Daylight Time (PDT) period.
 *
 * @param {Date|number} date The date to check.
 * @returns {boolean} True if the date is within PDT, false otherwise.
 */
const isPDT = (date) => {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = d.getMonth();
	const day = d.getDate();

	// Get the start and end dates of the DST period for the given year
	const dstStartDate = new Date(year, 2, 14);
	const dstEndDate = new Date(year, 10, 1);

	// Check if the date falls within the DST period
	if (
		(date >= dstStartDate && date <= dstEndDate) ||
		(month === 3 && day >= 8 && year > 2024)
	) {
		return true;
	}
	else {
		return false;
	}
};

/**
 * Recursively updates the interaction reply with the event status based on the current time.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction - The interaction that triggered the command.
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
			title: 'Kura-Kura (Turtle)',
			description: `Kura-Kura telah hadir di Pulau Tempat Suci di Padang Rumput Siang! Kunjungi Kura-Kura ini sebelum <t:${tsdateend.getTime() / 1000}:t>. (<t:${tsdateend.getTime() / 1000}:R>)`,
		});

		await interaction.editReply({ embeds: [embed], components: userActionRowBuilder(), ephemeral: options.hidden }).catch(err => errorHandler(err));
		return;
	}
	else {
		const embed = embedBuilder({
			client: interaction.client,
			user: interaction.user,
			title: 'Kura-Kura (Turtle)',
			description: `Kura-Kura selanjutnya akan hadir pada <t:${tsdatestart.getTime() / 1000}:t> hingga <t:${tsdateend.getTime() / 1000}:t>. (<t:${tsdatestart.getTime() / 1000}:R>)\n\nCatat waktunya dan jangan sampai ketinggalan untuk melihat keindahan alam dan matahari terbenam!`,
		});

		await interaction.editReply({ embeds: [embed], components: userActionRowBuilder(), ephemeral: options.hidden }).catch(err => errorHandler(err));
		return;
	}
}

/**
 * Handles the interaction to display information about the "Kura-Kura (Turtle)" event.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	const tsstartdate = `March 28, 2023 00:50:00 ${isPDT(new Date()) ? 'PDT' : 'PST'}`;
	const tsenddate = `March 28, 2023 01:00:00 ${isPDT(new Date()) ? 'PDT' : 'PST'}`;

	const tsstart = new Date(tsstartdate);
	const tsend = new Date(tsenddate);

	looping(interaction, options, tsstart, tsend);
};