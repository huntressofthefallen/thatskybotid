const { EmbedBuilder } = require('discord.js');

module.exports = async (client) => {
	const embed = new EmbedBuilder()
		.setTitle('Quick Dev Updates')
		.setURL('https://discord.com/channels/575762611111592007/1077716001493356574')
		.setDescription('Selamat datang di Quick Dev Updates! <a:bySqwarlockCyan:635918236801564690> Saluran ini adalah tempat bagi para pengembang untuk memberikan catatan singkat tentang apa yang terjadi dengan pengembangan game Sky, bug, patch, dan banyak lagi.\n<:SkyLook:649013670625542155> Untuk berita utama dan informasi patch, silakan terus ikuti kanal <#1009676335255408760> dan <#1009676463676588103> kami.')
		.setAuthor({ name: 'Stellify', iconURL: 'https://cdn.discordapp.com/avatars/553784838860177409/af503f07ceb8b8f8ea2f1e50583fba95.webp' })
		.setFooter({ text: '1077718663324516402' })
		.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
		.setColor('Random')
		.setTimestamp();

	await client.guilds.fetch('1009644872065613864').then(async (g2) => {
		await g2.channels.fetch('1077754426573467798').then(async (ch2) => {
			await ch2.send({ embeds: [embed] }).then(async (mes) => {
				if (mes.crosspostable) {
					await mes.crosspost().catch(err => console.error(err));
				}
			}).catch(err => console.error(err));
		}).catch(err => console.error(err));
	}).catch(err => console.error(err));
};