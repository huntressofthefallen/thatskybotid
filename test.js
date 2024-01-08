require('dotenv').config();
const translate = require('./scripts/translate');
const { S_TOKEN } = process.env;
const { Client, Options, GatewayIntentBits, Partials, Events } = require('discord.js');

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
	makeCache: Options.cacheEverything(),
});
client.login(S_TOKEN);


client.on(Events.ClientReady, async () => {
	const test = async () => {
		// thatskygame global guild
		const guild = await client.guilds.fetch('575762611111592007').catch(err => console.error(err.message));

		// thatskygame global channel of original announcement
		const channel = await guild.channels.fetch('1077716001493356574').catch(err => console.error(err.message));

		// message id of original announcement
		const message = await channel.messages.fetch('1184953096548397178').catch(err => console.error(err.message));

		let translated = await translate(message.content, { to: 'ID' });
		console.log(translated);

		const user = await client.users.fetch('800924763320745994').catch(err => console.error(err.message));

		await user.send(translated).catch(err => console.error(err.message));

		translated = await translate('hayoo yg hutang puasanya blm lunas semua, segera dibayar yaa <:Popcorn:1026661093713649717>	semakin cepat semakin bagus.', { to: 'EN' });
		console.log(translated);
	};

	await test();
});