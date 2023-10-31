module.exports = async (interaction) => {
	const options = { hidden: true };
	const showCommands = ['ts', 'geyser', 'grandma', 'turtle'];
	let showCommand = false;

	showCommands.forEach(cmdName => {
		if (interaction.commandName === cmdName) {
			showCommand = false;
		}
	});

	if (interaction.channel.id == '1030082965448962128' || showCommand) {
		options.hidden = false;
	}
	await interaction.deferReply({ ephemeral: options.hidden }).catch(err => console.error(err.message));

	if (interaction.commandName == 'help') {
		require('./commands/help')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'warn') {
		require('./commands/warn')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'unwarn') {
		require('./commands/unwarn')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'mute') {
		require('./commands/mute')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'unmute') {
		require('./commands/unmute')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'kick') {
		require('./commands/kick')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'ban') {
		require('./commands/ban')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'infraction') {
		require('./commands/infraction')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'escalate') {
		require('./commands/escalate')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'censorship') {
		require('./commands/censorship')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'ts') {
		require('./commands/ts')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'geyser') {
		require('./commands/geyser')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'grandma') {
		require('./commands/grandma')(interaction, options);
		return;
	}
	else if (interaction.commandName == 'turtle') {
		require('./commands/turtle')(interaction, options);
		return;
	}
	else {
		await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => console.error(err.message));
		return;
	}
};

// Credits: Huntress of the Fallen