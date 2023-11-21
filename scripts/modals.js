const errorHandler = require('./src/errorHandler');

module.exports = async (interaction) => {
	await interaction.deferReply({ ephemeral: true }).catch(err => errorHandler(err));
	if (interaction.customId == 'livefeed') {
		require('./modals/livefeed')(interaction);
	}
	else if (interaction.customId == 'betafeed') {
		require('./modals/betafeed')(interaction);
	}
	else if (interaction.customId == 'serverfeed') {
		require('./modals/serverfeed')(interaction);
	}
	else if (interaction.customId == 'contactmod') {
		require('./modals/contactmod')(interaction);
	}
	else if (interaction.customId == 'banappeal') {
		require('./modals/banappeal')(interaction);
	}
	else if (interaction.customId == 'replych') {
		require('./modals/replych')(interaction);
		return;
	}
	else if (interaction.customId == 'replydm') {
		require('./modals/replydm')(interaction);
		return;
	}
	else {
		await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
		return;
	}
};

// Credits: Huntress of the Fallen