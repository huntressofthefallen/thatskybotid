const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (client) => {
	const btn1 = new ButtonBuilder()
		.setLabel('Click to Submit Live Feedback')
		.setEmoji('📩')
		.setCustomId('livefeed')
		.setStyle(ButtonStyle.Success);
	const btn2 = new ButtonBuilder()
		.setLabel('Click to Submit Beta Feedback')
		.setEmoji('📮')
		.setCustomId('betafeed')
		.setStyle(ButtonStyle.Success);

	const btn3 = new ButtonBuilder()
		.setLabel('Click to Contact the Mods')
		.setEmoji('☎️')
		.setCustomId('contactmod')
		.setStyle(ButtonStyle.Success);

	const btn4 = new ButtonBuilder()
		.setLabel('Click to Submit Server Feedback')
		.setEmoji('💡')
		.setCustomId('serverfeed')
		.setStyle(ButtonStyle.Success);

	const btn5 = new ButtonBuilder()
		.setLabel('Click to Submit Ban Appeal (ID Discord Only)')
		.setEmoji('📮')
		.setCustomId('banappeal')
		.setStyle(ButtonStyle.Primary);

	const act1 = new ActionRowBuilder()
		.addComponents([btn1]);
	const act2 = new ActionRowBuilder()
		.addComponents([btn2]);
	const act3 = new ActionRowBuilder()
		.addComponents([btn3]);
	const act4 = new ActionRowBuilder()
		.addComponents([btn4]);
	const act5 = new ActionRowBuilder()
		.addComponents([btn5]);

	const embed = new EmbedBuilder()
		.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid', iconURL: client.user.displayAvatarURL() })
		.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
		.setColor([121, 209, 245])
		.setTimestamp()
		.setFooter({ text: client.user.id, iconURL: client.user.displayAvatarURL() });

	await client.channels.fetch('1010448800508289044').then(async ch => {
		embed.setTitle(`${ch.name}`).setDescription('Klik tombol di bawah dan berikan kritik serta saranmu untuk kami.\n\nKiriman berisi:\n• **Topik** dari kritik dan saran\n• **Penjelasan** seputar kritik dan saran\n• **Tangkapan layar** terkait kritik dan saran (Mohon mengunggahnya ke Google Drive atau melalui situs pihak ketiga apapun, salin dan tempel link-nya dalam formulir)');
		await ch.send({ embeds: [embed], components: [act1] }).catch(err => console.error(err));
	}).catch(err => console.error(err));

	await client.channels.fetch('1010445635331313694').then(async ch => {
		embed.setTitle(`${ch.name}`).setDescription('Klik tombol di bawah dan berikan kritik serta saranmu untuk kami.\n\nKiriman berisi:\n• **Topik** dari kritik dan saran\n• **Penjelasan** seputar kritik dan saran\n• **Tangkapan layar** terkait kritik dan saran (Mohon mengunggahnya ke Google Drive atau melalui situs pihak ketiga apapun, salin dan tempel link-nya dalam formulir)');
		await ch.send({ embeds: [embed], components: [act2] }).catch(err => console.error(err));
	}).catch(err => console.error(err));

	await client.channels.fetch('1010419210842816532').then(async ch => {
		embed.setTitle(`${ch.name}`).setDescription('Klik tombol di bawah dan berikan laporanmu mengenai masalah yang terjadi di Discord!\n\nLaporan berisi:\n• **Discord ID/Username** dari anggota yang melanggar\n• **Topik** dari masalah\n• **Penjelasan** seputar masalah\n• **Tangkapan layar** terkait masalah (Mohon mengunggahnya ke Google Drive atau melalui situs pihak ketiga apapun, salin dan tempel link-nya dalam formulir)');
		await ch.send({ embeds: [embed], components: [act3] }).catch(err => console.error(err));
	}).catch(err => console.error(err));

	await client.channels.fetch('1010415693298143243').then(async ch => {
		embed.setTitle(`${ch.name}`).setDescription('Klik tombol di bawah dan berikan kritik serta saranmu untuk kami.\n\nKiriman berisi:\n• **Topik** dari kritik dan saran\n• **Penjelasan** seputar kritik dan saran\n• **Tangkapan layar** terkait kritik dan saran (Mohon mengunggahnya ke Google Drive atau melalui situs pihak ketiga apapun, salin dan tempel link-nya dalam formulir)');
		await ch.send({ embeds: [embed], components: [act4] }).catch(err => console.error(err));
	}).catch(err => console.error(err));

	await client.channels.fetch('1031748186559238174').then(async ch => {
		embed.setTitle('Kirim Laporan Pengajuan Banding Ban Server Indonesia').setDescription('__Langkah untuk mengajukan banding atas larangan (Banned) akun Discordmu:__\n1. Mengapa kamu dibanned?\n2. Kapan kira-kira kamu dibanned?\n3. Kenapa banned untukmu harus dicabut?\n4. Apa langkah yang telah kamu ambil untuk memperbaiki penyebab dari banned tersebut?\n5. Berikan Discord User ID dari akun yang dibanned.\n6. Berikan Discord User ID untuk semua akun lainnya yang telah kamu gunakan, baikyang telah dibanned atau tidak.\n7. Pastikan DM (pesan pribadi) milikmu [terbuka](https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-) sehingga kami dapat menghubungimu mengenai aju banding darimu.\n\nDiscord User ID adalah nomor dengan 18 digit angka, **__bukan__** nama discordmu yang diikuti oleh # dan 4 digit angka. Untuk cara menemukan Discord User ID milikmu, silakan periksa [link berikut](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)\n\nContoh Discord User ID:\n>>>> 944345309205631016 <<<<\nContoh Discord User ID yang Salah:\nFr#9999');
		await ch.send({ embeds: [embed], components: [act5] }).catch(err => console.error(err));
	}).catch(err => console.error(err));
};