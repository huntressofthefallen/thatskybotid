const errorHandler = require('./src/errorHandler');

module.exports = async (interaction) => {
	const options = { hidden: true };
	if (interaction.channel.id == '1030082965448962128') {
		options.hidden = false;
	}
	await interaction.deferReply({ ephemeral: options.hidden }).catch(err => errorHandler(err));

	if (interaction.customId == 'mod') {
		if (interaction.values[0] == 'log') {
			require('./menus/log')(interaction, options);
		}
		else if (interaction.values[0] == 'warn') {
			require('./menus/warn')(interaction, options);
		}
		else if (interaction.values[0] == 'unmute') {
			require('./menus/unmute')(interaction, options);
		}
		else if (interaction.values[0].startsWith('mute')) {
			require('./menus/mute')(interaction, options);
		}
		else if (interaction.values[0] == 'kick') {
			require('./menus/kick')(interaction, options);
		}
		else if (interaction.values[0] == 'ban') {
			require('./menus/ban')(interaction, options);
		}
		else if (interaction.values[0] == 'unban') {
			require('./menus/unban')(interaction, options);
		}
		else {
			await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
			return;
		}
	}
	else {
		await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
		return;
	}
};

// Credits: Huntress of the Fallen