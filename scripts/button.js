module.exports = async (interaction) => {
	if (interaction.customId == 'livefeed') {
		require('./buttons/livefeed')(interaction);
		return;
	}
	else if (interaction.customId == 'betafeed') {
		require('./buttons/betafeed')(interaction);
		return;
	}
	else if (interaction.customId == 'serverfeed') {
		require('./buttons/serverfeed')(interaction);
	}
	else if (interaction.customId == 'contactmod') {
		require('./buttons/contactmod')(interaction);
		return;
	}
	else if (interaction.customId == 'banappeal') {
		require('./buttons/banappeal')(interaction);
		return;
	}
	else if (interaction.customId == 'replych') {
		require('./buttons/replych')(interaction);
		return;
	}
	else if (interaction.customId == 'replydm') {
		require('./buttons/replydm')(interaction);
		return;
	}
	else if (interaction.customId == 'done') {
		require('./buttons/done')(interaction);
		return;
	}
	else if (interaction.customId == 'safe') {
		require('./buttons/safe')(interaction);
		return;
	}
	else {
		await interaction.reply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => console.error(err));
		return;
	}
};

// Credits: Huntress of the Fallen