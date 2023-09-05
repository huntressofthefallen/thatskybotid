const { ApplicationCommandType } = require('discord.js');

module.exports = async (interaction) => {
	const options = { hidden: true };
	if (interaction.channel.id == '1030082965448962128') {
		options.hidden = false;
	}
	await interaction.deferReply({ ephemeral: options.hidden }).catch(err => console.error(err));

	if (interaction.commandType == ApplicationCommandType.Message) {
		if (interaction.commandName == 'Inappropriate Message') {
			require('./contextmenus/inappmessage')(interaction, options);
		}
		else if (interaction.commandName == 'Spam Message') {
			require('./contextmenus/spammessage')(interaction, options);
		}
		else if (interaction.commandName == 'Report Message') {
			require('./contextmenus/reportmessage')(interaction, options);
		}
		else {
			await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => console.error(err));
		}
	}
	else if (interaction.commandType == ApplicationCommandType.User) {
		if (interaction.commandName == 'Report User') {
			require('./contextmenus/reportuser')(interaction, options);
		}
		else {
			await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => console.error(err));
		}
	}
	else {
		await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => console.error(err));
	}
};