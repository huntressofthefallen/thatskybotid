require('dotenv').config();
const { REST, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, Routes, PermissionFlagsBits } = require('discord.js');
const { S_CLIENTID, S_TOKEN } = process.env;

const commands = [
	new SlashCommandBuilder()
		.setName('ts')
		.setDescription('Lihat Jadwal Roh Pengembara (Traveling Spirit) Selanjutnya.')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
	new SlashCommandBuilder()
		.setName('geyser')
		.setDescription('Lihat Jadwal Geyser Selanjutnya.')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
	new SlashCommandBuilder()
		.setName('grandma')
		.setDescription('Lihat Jadwal Nenek (Grandma) Selanjutnya.')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
	new SlashCommandBuilder()
		.setName('turtle')
		.setDescription('Lihat Jadwal Turtle Selanjutnya.')
		.setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
	new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Sky: Children of the Light Wiki Search Command')
		.setDMPermission(true)
		.addStringOption(option =>
			option
				.setName('search')
				.setDescription('Search with prefix/keywords of a Wiki Page')
				.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName('censorship')
		.setDescription('Words censorship from thatskybotid.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addSubcommand(subcommand =>
			subcommand
				.setName('whitelist')
				.setDescription('Whitelist a word from the censorship.')
				.addStringOption(option =>
					option
						.setName('word')
						.setDescription('Input one word to add to the whitelist (lowercase).')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Add a new word to the list.')
				.addStringOption(option =>
					option
						.setName('word')
						.setDescription('Input one word to add to the list (lowercase).')
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('automod')
						.setDescription('Enable/Disable automod for the word')
						.setRequired(true)
						.addChoices(
							{ name: 'Auto Mod', value: 'auto' },
							{ name: 'Manual Mod', value: 'manual' },
						),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Remove a word from the list.')
				.addStringOption(option =>
					option
						.setName('word')
						.setDescription('Input one word to add to the list (lowercase).')
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('category')
						.setDescription('The word category')
						.setRequired(true)
						.addChoices(
							{ name: 'Auto Mod Blacklist', value: 'pone' },
							{ name: 'Manual Mod Blacklist', value: 'ptwo' },
							{ name: 'Whitelist', value: 'whitelist' },
						),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('Edit a word from the list.')
				.addStringOption(option =>
					option
						.setName('word')
						.setDescription('Input one word to add to the list (lowercase).')
						.setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('automod')
						.setDescription('Edit the Category of Auto/Manual Mod for the word.')
						.setRequired(true)
						.addChoices(
							{ name: 'Change to Auto Mod', value: 'auto' },
							{ name: 'Change to Manual Mod', value: 'manual' },
						),
				),
		),
	new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Gives warning to a member.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(option => option
			.setName('user')
			.setDescription('User who gets the warning.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the warning.')
			.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName('unwarn')
		.setDescription('Removes a warning from a member.')
		.addStringOption(option => option
			.setName('_id')
			.setDescription('Database _id of the warning.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the warning.')
			.setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Gives a mute to a member.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(option => option
			.setName('user')
			.setDescription('User who gets the mutes.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('length')
			.setDescription('Timeout time length for the mutes.')
			.setRequired(true)
			.addChoices(
				{ name: '1 Hour', value: '1h' },
				{ name: '8 Hours', value: '8h' },
				{ name: '1 Day', value: '1d' },
				{ name: '2 Days', value: '2d' },
				{ name: '3 Days', value: '3d' },
				{ name: '7 Days', value: '7d' },
			),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the mutes.')
			.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Removes a mute to a member.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(option => option
			.setName('user')
			.setDescription('User who gets the mutes.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the mutes.')
			.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(option => option
			.setName('user')
			.setDescription('User who gets the kick.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the kick.')
			.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Ban a member.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addUserOption(option => option
			.setName('user')
			.setDescription('User who gets the bans.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the bans.')
			.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName('infraction')
		.setDescription('See a member moderation infraction log.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('User to see the infraction log.')
			.setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	new SlashCommandBuilder()
		.setName('escalate')
		.setDescription('Escalate a member infractions to automoderation steps.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.addUserOption(option => option
			.setName('user')
			.setDescription('User to use auto escalation.')
			.setRequired(true),
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('Reason for the escalation.')
			.setRequired(true),
		),
	new ContextMenuCommandBuilder()
		.setName('(MOD) Inappropriate Message')
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	new ContextMenuCommandBuilder()
		.setName('(MOD) Spam Message')
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	new ContextMenuCommandBuilder()
		.setName('Translate to English')
		.setType(ApplicationCommandType.Message),
	new ContextMenuCommandBuilder()
		.setName('Translate to Indonesian')
		.setType(ApplicationCommandType.Message),
	new ContextMenuCommandBuilder()
		.setName('Report Message')
		.setType(ApplicationCommandType.Message),
	new ContextMenuCommandBuilder()
		.setName('Report User')
		.setType(ApplicationCommandType.User),
]
	.map(command => command.toJSON());


// const globalCommands = [
// 	new ContextMenuCommandBuilder()
// 		.setName('Translate to English')
// 		.setType(ApplicationCommandType.Message),
// 	new ContextMenuCommandBuilder()
// 		.setName('Translate to Indonesian')
// 		.setType(ApplicationCommandType.Message),
// ]
// 	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(S_TOKEN);

rest.put(Routes.applicationGuildCommands(S_CLIENTID, '1009644872065613864'), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands in Indonesian Server.`))
	.catch(err => console.error(err.message));

// rest.put(Routes.applicationGuildCommands(S_CLIENTID, '575762611111592007'), { body: globalCommands })
// 	.then((data) => console.log(`Successfully registered ${data.length} application commands in Global Server.`))
// 	.catch(err => console.error(err.message));

// Credits: Huntress of the Fallen