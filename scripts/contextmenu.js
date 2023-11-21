const { ApplicationCommandType } = require('discord.js');
const errorHandler = require('./src/errorHandler');

module.exports = async (interaction) => {
	const options = { hidden: true };
	if (interaction.channel.id == '1030082965448962128') {
		options.hidden = false;
	}
	await interaction.deferReply({ ephemeral: options.hidden }).catch(err => errorHandler(err));

	if (interaction.commandType == ApplicationCommandType.Message) {
		if (interaction.commandName == '(MOD) Inappropriate Message') {
			require('./contextmenus/inappmessage')(interaction, options);
		}
		else if (interaction.commandName == '(MOD) Spam Message') {
			require('./contextmenus/spammessage')(interaction, options);
		}
		else if (interaction.commandName == 'Report Message') {
			require('./contextmenus/reportmessage')(interaction, options);
		}
		else if (interaction.commandName == 'Translate to English') {
			require('./contextmenus/translateEnglish')(interaction);
		}
		else if (interaction.commandName == 'Translate to Indonesian') {
			require('./contextmenus/translateIndonesian')(interaction);
		}
		else {
			await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
		}
	}
	else if (interaction.commandType == ApplicationCommandType.User) {
		if (interaction.commandName == 'Report User') {
			require('./contextmenus/reportuser')(interaction, options);
		}
		else {
			await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
		}
	}
	else {
		await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
	}
};