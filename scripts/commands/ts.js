const embedBuilder = require('../builders/embed');

const getDateInTimeZone = (date, timeZone) => {
	const utcDate = new Date(date);
	const tzDate = new Date(utcDate.toLocaleString('en-US', { timeZone }));
	const offset = utcDate.getTime() - tzDate.getTime();
	return new Date(utcDate.getTime() + offset);
};

async function looping(interaction, options, tsdatestart, tsdateend) {
	const today = new Date().getTime();

	if (today > tsdateend.getTime()) {
		const tsstart = new Date(tsdatestart.getTime() + 14 * 24 * 60 * 60 * 1000);
		const tsend = new Date(tsdateend.getTime() + 14 * 24 * 60 * 60 * 1000);
		looping(interaction, options, tsstart, tsend);
	}
	else if (today > tsdatestart.getTime()) {
		const embed = embedBuilder({
			client: interaction.client,
			user: interaction.user,
			title: 'Roh Pengembara',
			description: `Roh Pengembara telah hadir di Rumah! Kunjungi Roh Pengembara ini sebelum <t:${tsdateend.getTime() / 1000}:F>`,
		});

		await interaction.editReply({ embeds: [embed], ephemeral: options.hidden }).catch(err => console.error(err.message));
		return;
	}
	else {
		const embed = embedBuilder({
			client: interaction.client,
			user: interaction.user,
			title: 'Roh Pengembara',
			description: `Roh Pengembara selanjutnya akan hadir pada <t:${tsdatestart.getTime() / 1000}:F> hingga <t:${tsdateend.getTime() / 1000}:F>.\n\nJangan lupa untuk catat tanggalnya!`,
		});

		await interaction.editReply({ embeds: [embed], ephemeral: options.hidden }).catch(err => console.error(err.message));
		return;
	}
}

module.exports = async (interaction, options) => {
	const tsstartdate = 'March 30, 2023 00:00:00';
	const tsenddate = 'April 2, 2023 23:59:59';

	const tsstart = getDateInTimeZone(tsstartdate, 'America/Los_Angeles');
	const tsend = getDateInTimeZone(tsenddate, 'America/Los_Angeles');

	looping(interaction, options, tsstart, tsend);
};