const { EmbedBuilder } = require('discord.js');
const translate = require('./scripts/translate');

module.exports = async (client) => {
	// thatskygame global guild
	const guild = await client.guilds.fetch('575762611111592007').catch(console.error);

	// thatskygame global channel of original announcement
	const channel = await client.channels.fetch('1077716001493356574').catch(console.error);

	// message id of original announcement
	const message = await channel.messages.fetch('1166433374492184656').catch(console.error);

	// thatskygameid indonesia channel for posting announcement
	const postChannel = await client.channels.fetch('1077754426573467798').catch(console.error);

	// fetching the author member data from global guild
	const member = await guild.members.fetch(message.author.id).catch(console.error);

	// Google translate and posting announcements
	translate(message.content, { to: 'id' }).then(async res => {
		const embed = new EmbedBuilder()
			.setTitle('Quick Dev Updates')
			.setURL(`https://discord.com/channels/575762611111592007/1077716001493356574/${message.id}`)
			.setDescription(res)
			.setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
			.setFooter({ text: message.id })
			.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
			.setColor('Random')
			.setTimestamp();

		await postChannel.send({ embeds: [embed] }).then(async (mes) => {
			if (mes.crosspostable) {
				await mes.crosspost().catch(err => console.error(err));
			}
		}).catch(err => console.error(err));
	}).catch(err => console.error(err));
};