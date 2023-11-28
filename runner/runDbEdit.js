const LogsModel = require('../database/lib/s').log;

async function updateData() {
	const logsData = await LogsModel.find({ userId: { $exists: true }, id: { $exists: true } });

	const updatePromises = logsData.map(async (log) => {
		const updatedData = {};

		// Set new fields if the old fields exist
		if (log.id) updatedData.userId = log.id;
		if (log.category) updatedData.action = log.category === 'warn' ? 'warning' : log.category;
		if (log.mod) updatedData.modId = log.mod;
		if (log.time) updatedData.length = log.time;

		// Unset old fields if they exist
		const unsetFields = {};
		if (log.id) unsetFields.id = '';
		if (log.category) unsetFields.category = '';
		if (log.mod) unsetFields.mod = '';
		if (log.time) unsetFields.time = '';

		if (Object.keys(unsetFields).length > 0) {
			updatedData.$unset = unsetFields;
		}

		await LogsModel.updateOne({ _id: log._id }, updatedData);
		console.log(`Updated record with _id: ${log._id}`);
	});

	await Promise.all(updatePromises);
	console.log('Data update completed');
}

updateData();