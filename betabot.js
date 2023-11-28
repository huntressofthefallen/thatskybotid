require('dotenv').config();
const { S_TOKEN } = process.env;
const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.Channel,
		Partials.Message,
		Partials.User,
		Partials.GuildScheduledEvent,
		Partials.GuildMember,
		Partials.Reaction,
	],
	allowedMentions: { repliedUser: false },
});

client.once(Events.ClientReady, async () => {
	// require('./deploy-commands');
	// require('./react')(client);
	// require('./checkallmembers')(client);
	// require('./idbadwords');
	// require('./mongodbrefresh');
	// require('./modalMessage')(client);
	require('./runner/translateann')(client);
	console.log('thatskybotid BOT is Ready!');
});

client.login(S_TOKEN);

// Credits: Huntress of the Fallen