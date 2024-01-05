require('dotenv').config();
const { S_TOKEN } = process.env;
const { Client, Options, GatewayIntentBits, Partials, ActivityType, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');
const client = new Client({
	shards: getInfo().SHARD_LIST,
	shardCount: getInfo().TOTAL_SHARDS,
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
client.cluster = new ClusterClient(client);

const skiproleid = ['1009673144744816670', '1009732058555367475', '1009733483825995846'];

const { RateLimiter } = require('discord.js-rate-limiter');
const mentionSpamLimiter = new RateLimiter(4, 6 * 1000);
const spamLimiter = new RateLimiter(5, 4 * 1000);
const { log } = require('./database/lib/s');

const embedBuilder = require('./scripts/builders/embed');
const modActionRow = require('./scripts/builders/modActionRow');
const userActionRowBuilder = require('./scripts/builders/userActionRow');
const checkEscalation = require('./scripts/src/checkEscalation');
const errorHandler = require('./scripts/src/errorHandler');

const banMessage = require('./scripts/messages/ban');
const warningMessage = require('./scripts/messages/warn');
const kickMessage = require('./scripts/messages/kick');
const muteMessage = require('./scripts/messages/mute');

const translate = require('./scripts/translate');

const fetchAllBans = require('./scripts/src/fetchAllBans');
const checkCensoredWords = require('./scripts/src/checkCensoredWords');

client.on(Events.MessageCreate, async (message) => {
	if (message.partial) {
		await message.fetch().catch(err => errorHandler(err));
	}
	if (message.member) {
		if (message.member.partial) {
			await message.member.fetch().catch(err => errorHandler(err));
		}
	}
	if (message.channel.partial) {
		await message.channel.fetch().catch(err => errorHandler(err));
	}
	if (message.author.partial) {
		await message.author.fetch().catch(err => errorHandler(err));
	}

	if (message.author.bot || message.channel.type == ChannelType.DM) {
		return;
	}
	else if (message.channel.type == ChannelType.GuildText && message.guild.id == '1009644872065613864') {
		let skipmessage = false;

		await message.member.fetch().then(async tmem => {
			const mesarole = tmem.roles.cache;
			skiproleid.forEach(skrole => {
				mesarole.forEach(memrole => {
					if (skrole == memrole.id) {
						skipmessage = true;
					}
				});
			});
			if (skipmessage) {
				return;
			}
			else {
				const spam = spamLimiter.take(message.author.id);

				let mentionSpam;
				if (message.mentions.users.size > 0 || message.mentions.roles.size > 0) {
					mentionSpam = mentionSpamLimiter.take(message.author.id);
				}

				const SafeButt = new ButtonBuilder()
					.setCustomId('safe')
					.setEmoji('🛡️')
					.setLabel('Safe')
					.setStyle(ButtonStyle.Success);

				const safeActionRow = new ActionRowBuilder()
					.addComponents([SafeButt]);

				if (spam || mentionSpam) {
					await message.channel.messages.fetch({ limit: 100 }).then(async (messagesFetched) => {
						messagesFetched.filter(m => m.author.id === message.author.id).forEach(async messageFetched => {
							await messageFetched.delete().catch(err => errorHandler(err));
						});
					}).catch(err => errorHandler(err));

					const userId = message.author.id;
					const guildId = message.guild.id;
					const escalation = await checkEscalation(userId, guildId);

					if (!escalation) {
						await warningMessage(message, client, 'Spamming Server');
						return;
					}

					switch (escalation.action) {
						case 'ban':
							await banMessage(message, client, 'Spamming Server');
							break;
						case 'warning':
							await warningMessage(message, client, 'Spamming Server');
							break;
						case 'kick':
							await kickMessage(message, client, 'Spamming Server');
							break;
						case 'mute':
							await muteMessage(message, client, 'Spamming Server', escalation.duration);
							break;
						default:
							await warningMessage(message, client, 'Spamming Server');
							break;
					}
				}
				else {
					const args = message.content.toLowerCase().trim().replace(/4|@/gi, 'a').replace(/\$/gi, 's').replace(/1|!/gi, 'i').replace(/0/gi, 'o').replace(/3/gi, 'e').split(/\s+/gi);
					const censorship = await checkCensoredWords(args);

					let mess;
					let severity = 0;
					censorship.words.forEach(async (x, i) => {
						if (x.cat == 1 && severity < 2) {
							severity = 2;
						}
						else if (x.cat > 1 && severity < 1) {
							severity = 1;
						}
						if (mess) {
							mess = `${mess}\n${i + 1}. ${x.word} (${x.det}) => Category ${x.cat}`;
						}
						else {
							mess = `${i + 1}. ${x.word} (${x.det}) => Category ${x.cat}`;
						}
					});

					const idGuild = await client.guilds.fetch('1009644872065613864').catch(err => errorHandler(err));
					const idGuildInvites = await idGuild.invites.fetch().catch(err => errorHandler(err));
					let thisGuildInvite = false;
					const htMessage = message.content.toLowerCase().replace(/\s/g, '');
					idGuildInvites?.forEach(guildInvite => {
						if (htMessage.includes(guildInvite.url) || htMessage.includes(guildInvite.code)) {
							thisGuildInvite = true;
						}
					});

					if (htMessage.includes('discord.gg') || htMessage.includes('discord.com/invite')) {
						if (!htMessage.includes('discord.gg/thatskygame') && !htMessage.includes('discord.com/invite/thatskygame') && !htMessage.includes('discord.gg/thatskygameid') && !htMessage.includes('discord.com/invite/thatskygameid') && !thisGuildInvite) {
							severity = 2;
							if (mess) {
								mess = `${mess}\n[Outside thatskygame Invitation Link]`;
							}
							else {
								mess = '[Outside thatskygame Invitation Link]';
							}
						}
					}
					else {
						const tradeHeartKeywords = ['hearttrade', 'tradeheart', 'tradehati', 'tukeranhati', 'tukaranhati', 'bagihati', 'mintahati', 'tukeranheart', 'tukaranheart', 'bagiheart', 'tukarhati', 'tukarheart', 'bthati', 'btheart', 'mintaheart', 'beliheart', 'belihati', 'jualhati', 'jualheart', 'kasihheart', 'kasihhati'];

						tradeHeartKeywords.forEach(keyword => {
							if (htMessage.includes(keyword)) {
								severity = 2;
								if (mess) {
									mess = `${mess}\n[Heart Trade Discussion]`;
								}
								else {
									mess = '[Heart Trade Discussion]';
								}
							}
						});
					}

					if (severity == 2) {
						await message.delete().catch(err => errorHandler(err));

						const userId = message.author.id;
						const guildId = message.guild.id;
						const escalation = await checkEscalation(userId, guildId);

						if (!escalation) {
							await warningMessage(message, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
							return;
						}

						switch (escalation.action) {
							case 'ban':
								await banMessage(message, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
								break;
							case 'warning':
								await warningMessage(message, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
								break;
							case 'kick':
								await kickMessage(message, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
								break;
							case 'mute':
								await muteMessage(message, client, 'Melanggar Peraturan Server -> <#1010418542266560532>', escalation.duration);
								break;
							default:
								await warningMessage(message, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
								break;
						}
					}
					else if (severity == 1) {
						const embed = embedBuilder({
							client,
							user: message.author,
							title: 'Message Flagged Log',
							description: `${message.author.username}'s message has been flagged with the reason of Potentially using Inappropriate Words.`,
							fields: [
								{ name: 'Reason', value: 'Menggunakan Kata-Kata yang Melanggar Peraturan', inline: false },
								{ name: 'Words', value: `${mess}`, inline: false },
								{ name: 'Message Link', value: `[Click Here to go to the Message](${message.url})`, inline: false },
							],
						});

						await message.guild.channels.fetch('1030082965448962128').then(async ch => {
							await ch.send({ embeds: [embed], components: [...modActionRow(), safeActionRow] }).catch(err => errorHandler(err));
						}).catch(err => errorHandler(err));
					}
				}
			}
		}).catch(err => errorHandler(err));
	}
	else if (message.channel.type == ChannelType.GuildAnnouncement && message.guild.id == '1009644872065613864') {
		if (message.crosspostable) {
			await message.crosspost().catch(err => errorHandler(err));
		}
	}
	else if (message.channel.type == ChannelType.GuildAnnouncement && message.guild.id == '575762611111592007' && message.channel.id == '1077716001493356574') {
		translate(message.content, { to: 'ID' }).then(async res => {
			const embed = new EmbedBuilder()
				.setTitle('Quick Dev Updates')
				.setURL(`https://discord.com/channels/575762611111592007/1077716001493356574/${message.id}`)
				.setDescription(res)
				.setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL() })
				.setFooter({ text: `${message.id}` })
				.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
				.setColor('Random')
				.setTimestamp();

			await client.guilds.fetch('1009644872065613864').then(async (g) => {
				await g.channels.fetch('1077754426573467798').then(async (ch) => {
					await ch.send({ embeds: [embed] }).then(async (mes) => {
						if (mes.crosspostable) {
							await mes.crosspost().catch(err => errorHandler(err));
						}
					}).catch(err => errorHandler(err));
				}).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}).catch(err => errorHandler(err));
	}
	else if (message.channel.type == ChannelType.GuildAnnouncement && message.guild.id == '575762611111592007' && message.channel.id == '628684058414678026') {
		translate(message.content, { to: 'ID' }).then(async res => {
			const embed = new EmbedBuilder()
				.setTitle('Known Issues')
				.setURL(`https://discord.com/channels/575762611111592007/628684058414678026/${message.id}`)
				.setDescription(res)
				.setAuthor({ name: message.member.displayName, iconURL: message.member.displayAvatarURL() })
				.setFooter({ text: `${message.id}` })
				.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
				.setColor('Random')
				.setTimestamp();

			await client.guilds.fetch('1009644872065613864').then(async (g) => {
				await g.channels.fetch('1009676463676588103').then(async (ch) => {
					await ch.send({ embeds: [embed] }).then(async (mes) => {
						if (mes.crosspostable) {
							await mes.crosspost().catch(err => errorHandler(err));
						}
					}).catch(err => errorHandler(err));
				}).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}).catch(err => errorHandler(err));
	}
});

client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
	if (newMessage.partial) {
		await newMessage.fetch().catch(err => errorHandler(err));
	}
	if (newMessage.author.partial) {
		await newMessage.author.fetch().catch(err => errorHandler(err));
	}
	if (newMessage.member) {
		if (newMessage.member.partial) {
			await newMessage.member.fetch().catch(err => errorHandler(err));
		}
	}
	if (newMessage.channel.partial) {
		await newMessage.channel.fetch().catch(err => errorHandler(err));
	}

	if (newMessage.author.bot || newMessage.channel.type == ChannelType.DM) {
		return;
	}
	else if (newMessage.channel.type == ChannelType.GuildText && newMessage.guild.id == '1009644872065613864') {
		let skipmessage = false;

		await newMessage.member.fetch().then(async tmem => {
			const mesarole = tmem.roles.cache;
			skiproleid.forEach(skrole => {
				mesarole.forEach(memrole => {
					if (skrole == memrole.id) {
						skipmessage = true;
					}
				});
			});
			if (skipmessage) {
				return;
			}
			else {
				const args = newMessage.content.toLowerCase().trim().replace(/4|@/gi, 'a').replace(/\$/gi, 's').replace(/1|!/gi, 'i').replace(/0/gi, 'o').replace(/3/gi, 'e').split(/\s+/gi);
				const censorship = await checkCensoredWords(args);

				let mess;
				let severity = 0;
				censorship.words.forEach(async (x, i) => {
					if (x.cat == 1 && severity < 2) {
						severity = 2;
					}
					else if (x.cat > 1 && severity < 1) {
						severity = 1;
					}
					if (mess) {
						mess = `${mess}\n${i + 1}. ${x.word} (${x.det}) => Category ${x.cat}`;
					}
					else {
						mess = `${i + 1}. ${x.word} (${x.det}) => Category ${x.cat}`;
					}
				});

				const idGuild = await client.guilds.fetch('1009644872065613864').catch(err => errorHandler(err));
				const idGuildInvites = await idGuild.invites.fetch().catch(err => errorHandler(err));
				let thisGuildInvite = false;
				const htMessage = newMessage.content.toLowerCase().replace(/\s/g, '');
				idGuildInvites?.forEach(guildInvite => {
					if (htMessage.includes(guildInvite.url) || htMessage.includes(guildInvite.code)) {
						thisGuildInvite = true;
					}
				});

				if (htMessage.includes('hearttrade') || htMessage.includes('tradeheart') || htMessage.includes('tradehati')) {
					severity = 2;
					if (mess) {
						mess = `${mess}\n[Heart Trade Discussion]`;
					}
					else {
						mess = '[Heart Trade Discussion]';
					}
				}
				else if (htMessage.includes('discord.gg') || htMessage.includes('discord.com/invite')) {
					if (!htMessage.includes('discord.gg/thatskygame') && !htMessage.includes('discord.com/invite/thatskygame') && !thisGuildInvite) {
						severity = 2;
						if (mess) {
							mess = `${mess}\n[Outside thatskygame Invitation Link]`;
						}
						else {
							mess = '[Outside thatskygame Invitation Link]';
						}
					}
				}

				const SafeButt = new ButtonBuilder()
					.setCustomId('safe')
					.setEmoji('🛡️')
					.setLabel('Safe')
					.setStyle(ButtonStyle.Success);

				const safeActionRow = new ActionRowBuilder()
					.addComponents([SafeButt]);

				if (severity == 2) {
					await newMessage.delete().catch(err => errorHandler(err));

					const userId = newMessage.author.id;
					const guildId = newMessage.guild.id;
					const escalation = await checkEscalation(userId, guildId);

					if (!escalation) {
						await warningMessage(newMessage, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
						return;
					}

					switch (escalation.action) {
						case 'ban':
							await banMessage(newMessage, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
							break;
						case 'warning':
							await warningMessage(newMessage, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
							break;
						case 'kick':
							await kickMessage(newMessage, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
							break;
						case 'mute':
							await muteMessage(newMessage, client, 'Melanggar Peraturan Server -> <#1010418542266560532>', escalation.duration);
							break;
						default:
							await warningMessage(newMessage, client, 'Melanggar Peraturan Server -> <#1010418542266560532>');
							break;
					}
				}
				else if (severity == 1) {
					const embed = embedBuilder({
						client,
						user: newMessage.author,
						title: 'Message Flagged Log',
						description: `${newMessage.author.username}'s message has been flagged with the reason of Potentially using Inappropriate Words.`,
						fields: [
							{ name: 'Reason', value: 'Menggunakan Kata-Kata yang Melanggar Peraturan', inline: false },
							{ name: 'Words', value: `${mess}`, inline: false },
							{ name: 'Message Link', value: `[Click Here to go to the Message](${newMessage.url})`, inline: false },
						],
					});

					await newMessage.guild.channels.fetch('1030082965448962128').then(async ch => {
						await ch.send({ embeds: [embed], components: [...modActionRow(), safeActionRow] }).catch(err => errorHandler(err));
					}).catch(err => errorHandler(err));
				}
			}
		}).catch(err => errorHandler(err));
	}
	else if (newMessage.channel.type == ChannelType.GuildAnnouncement && newMessage.guild.id == '575762611111592007' && newMessage.channel.id == '1077716001493356574') {
		translate(newMessage.content, { to: 'ID' }).then(async res => {
			const embed = new EmbedBuilder()
				.setTitle('Quick Dev Updates')
				.setURL(`https://discord.com/channels/575762611111592007/1077716001493356574/${newMessage.id}`)
				.setDescription(res)
				.setAuthor({ name: newMessage.member.displayName, iconURL: newMessage.member.displayAvatarURL() })
				.setFooter({ text: `${newMessage.id}` })
				.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
				.setColor('Random')
				.setTimestamp();

			await client.guilds.fetch('1009644872065613864').then(async (g) => {
				await g.channels.fetch('1077754426573467798').then(async (ch) => {
					await ch.messages.fetch({ limit: 100 }).then(async msgs => {
						msgs.forEach(async msg => {
							if (msg.embeds[0] && msg.embeds[0].footer.text == newMessage.id) {
								await msg.edit({ embeds: [embed] }).then(async (mes) => {
									if (mes.crosspostable) {
										await mes.crosspost().catch(err => errorHandler(err));
									}
								}).catch(err => errorHandler(err));
							}
						});
					}).catch(err => errorHandler(err));
				}).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}).catch(err => errorHandler(err));
	}
	else if (newMessage.channel.type == ChannelType.GuildAnnouncement && newMessage.guild.id == '575762611111592007' && newMessage.channel.id == '628684058414678026') {
		translate(newMessage.content, { to: 'ID' }).then(async res => {
			const embed = new EmbedBuilder()
				.setTitle('Known Issues')
				.setURL(`https://discord.com/channels/575762611111592007/628684058414678026/${newMessage.id}`)
				.setDescription(res)
				.setAuthor({ name: newMessage.member.displayName, iconURL: newMessage.member.displayAvatarURL() })
				.setFooter({ text: `${newMessage.id}` })
				.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
				.setColor('Random')
				.setTimestamp();

			await client.guilds.fetch('1009644872065613864').then(async (g) => {
				await g.channels.fetch('1009676463676588103').then(async (ch) => {
					await ch.messages.fetch({ limit: 100 }).then(async msgs => {
						msgs.forEach(async msg => {
							if (msg.embeds[0] && msg.embeds[0].footer.text == newMessage.id) {
								await msg.edit({ embeds: [embed] }).then(async (mes) => {
									if (mes.crosspostable) {
										await mes.crosspost().catch(err => errorHandler(err));
									}
								}).catch(err => errorHandler(err));
							}
						});
					}).catch(err => errorHandler(err));
				}).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}).catch(err => errorHandler(err));
	}
});

client.on(Events.MessageDelete, async (message) => {
	if (message.channel.type == ChannelType.GuildAnnouncement && message.guild.id == '575762611111592007' && message.channel.id == '1077716001493356574') {
		await client.guilds.fetch('1009644872065613864').then(async (g) => {
			await g.channels.fetch('1077754426573467798').then(async (ch) => {
				await ch.messages.fetch({ limit: 100 }).then(async msgs => {
					msgs.forEach(async msg => {
						if (msg.embeds[0] && msg.embeds[0].footer.text == message.id) {
							await msg.delete().catch(err => errorHandler(err));
						}
					});
				}).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}).catch(err => errorHandler(err));
	}
	else if (message.channel.type == ChannelType.GuildAnnouncement && message.guild.id == '575762611111592007' && message.channel.id == '628684058414678026') {
		await client.guilds.fetch('1009644872065613864').then(async (g) => {
			await g.channels.fetch('1009676463676588103').then(async (ch) => {
				await ch.messages.fetch({ limit: 100 }).then(async msgs => {
					msgs.forEach(async msg => {
						if (msg.embeds[0] && msg.embeds[0].footer.text == message.id) {
							await msg.delete().catch(err => errorHandler(err));
						}
					});
				}).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}).catch(err => errorHandler(err));
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.user.partial) {
		await interaction.user.fetch().catch(err => errorHandler(err));
	}

	if (interaction.member) {
		if (interaction.member.partial) {
			await interaction.member.fetch().catch(err => errorHandler(err));
		}
	}

	if (interaction.message) {
		await interaction.message.fetch().catch(err => errorHandler(err));
	}

	if (interaction.channel.partial) {
		await interaction.channel.fetch().catch(err => errorHandler(err));
	}

	if (interaction.isMessageContextMenuCommand()) {
		await interaction.targetMessage.fetch().catch(err => errorHandler(err));
	}
	else if (interaction.isUserContextMenuCommand()) {
		await interaction.targetUser.fetch().catch(err => errorHandler(err));
	}

	if (interaction.channel.type == ChannelType.DM) {
		if (interaction.isButton()) {
			require('./scripts/button')(interaction);
		}
		else if (interaction.isModalSubmit()) {
			require('./scripts/modals')(interaction);
		}
	}
	else if (interaction.guild.id == '1009644872065613864') {
		if (interaction.isChatInputCommand()) {
			require('./scripts/commands')(interaction);
		}
		else if (interaction.isStringSelectMenu()) {
			if (interaction.customId != 'wiki') {
				require('./scripts/menu')(interaction);
			}
		}
		else if (interaction.isButton()) {
			require('./scripts/button')(interaction);
		}
		else if (interaction.isModalSubmit()) {
			require('./scripts/modals')(interaction);
		}
		else if (interaction.isContextMenuCommand()) {
			require('./scripts/contextmenu')(interaction);
		}
		else {
			await interaction.reply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
		}
	}
	else if (interaction.guild.id == '902592618444255252') {
		if (interaction.isButton()) {
			if (interaction.customId == 'banappeal' || interaction.customId == 'replych' || interaction.customId == 'done') {
				require('./scripts/button')(interaction);
			}
			else {
				await interaction.reply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
			}
		}
		else if (interaction.isContextMenuCommand()) {
			require('./scripts/contextmenu')(interaction);
		}
		else if (interaction.isModalSubmit()) {
			if (interaction.customId == 'banappeal' || interaction.customId == 'replych') {
				require('./scripts/modals')(interaction);
			}
			else {
				await interaction.reply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
			}
		}
		else {
			await interaction.reply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
		}
	}
	else {
		await interaction.reply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => errorHandler(err));
	}
});

client.on(Events.GuildMemberAdd, async (member) => {
	if (member.partial) {
		await member.fetch().catch(err => errorHandler(err));
	}
	if (member.guild.id == '1009644872065613864') {
		let banned = false;
		const globalGuild = await client.guilds.fetch('575762611111592007').catch(err => errorHandler(err));
		const globalGuildBans = await fetchAllBans(globalGuild).catch(err => errorHandler(err));

		globalGuildBans.forEach(async gban => {
			if (member.user.id == gban.user.id) {
				banned = true;
				const embed = new EmbedBuilder()
					.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid', iconURL: client.user.displayAvatarURL() })
					.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
					.setColor('Random')
					.setTimestamp()
					.setFooter({ text: 'Global Server Auto Ban', iconURL: client.user.displayAvatarURL() });
				embed.setTitle(`Halo ${member.user.username},`).setDescription(`Kamu telah diban dari ${member.guild.name} dengan alasan telah diban dari Server Global dengan alasan __${gban.reason}__\n\nUntuk mengajukan banding atas ban yang kamu terima, kamu dapat menghubungi kami melalui server berikut ini:\nhttps://bit.ly/SkyDiscordBanReview`);
				await member.send({ embeds: [embed], components: userActionRowBuilder() }).catch(err => errorHandler(err));

				const data = { id: member.user.id, category: 'ban', reason: `Global: ${gban.reason}`, mod: client.user.id };
				log.create(data).then(async () => {
					await member.ban({ deleteMessageSeconds: 60 * 60 * 24 * 7, reason: `Global: ${gban.reason}` }).then(async () => {
						await member.guild.channels.fetch('1016585021651427370').then(async ch => {
							embed.setTitle('Global Auto Ban Log').setDescription(`${member.user.username} has been banned.`).setFields({ name: 'Moderator', value: `${client.user.username}`, inline: false }, { name: 'Reason', value: `Global: ${gban.reason}`, inline: false });
							// eslint-disable-next-line max-nested-callbacks
							await ch.send({ embeds: [embed] }).catch(err => errorHandler(err));
						}).catch(err => errorHandler(err));
					}).catch(err => errorHandler(err));
				}).catch(err => errorHandler(err));
			}
		});

		if (!banned) {
			const embed = new EmbedBuilder()
				.setTitle('Selamat Datang di Discord 🇮🇩 Sky: Children of the Light ID!')
				.setDescription('Jangan lupa untuk membaca dan menyetujui aturan di 🇮🇩 Sky: Children of the Light ID sebelum kamu membuka channel lainnya dan berbincang bersama teman-temanmu.')
				.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid', iconURL: client.user.displayAvatarURL() })
				.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
				.setColor('Random')
				.setTimestamp()
				.setFooter({ text: member.id, iconURL: member.displayAvatarURL() });

			await member.send({ embeds: [embed], components: userActionRowBuilder() }).catch(err => errorHandler(err));
		}
	}
});

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
	if (newMember.guild.id == '1009644872065613864') {
		await newMember.fetch().catch(err => errorHandler(err));
		if (oldMember.pending && !newMember.pending) {
			await newMember.guild.roles.fetch('1009736934765113415').then(async r => {
				await newMember.roles.add(r).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}
		else if (!newMember.pending) {
			await newMember.guild.roles.fetch('1009736934765113415').then(async r => {
				await newMember.roles.add(r).catch(err => errorHandler(err));
			}).catch(err => errorHandler(err));
		}
	}
});

client.on(Events.GuildBanAdd, async (ban) => {
	if (ban.partial) {
		await ban.fetch().catch(err => errorHandler(err));
	}
	if (ban.user.partial) {
		await ban.user.fetch().catch(err => errorHandler(err));
	}
	if (ban.guild.id == '575762611111592007') {
		const idGuild = await client.guilds.fetch('1016585021651427370').catch(err => errorHandler(err));
		let actionStatus = false;
		const dmStatus = false;
		const idMember = await idGuild.members.fetch(ban.user.id).catch(err => errorHandler(err));

		if (idMember) {
			await idMember.ban({ deleteMessageSeconds: 7 * 24 * 60 * 60, reason: ban.reason }).catch(err => errorHandler(err));

			actionStatus = true;

			const logChannel = await idGuild.channels.fetch('1016585021651427370').catch(err => errorHandler(err));
			const logEmbed = embedBuilder({
				client,
				user: ban.user,
				title: 'Ban Log',
				description: `[${ban.user.id}] ${ban.user.username} has been **__banned__** from Global Server`,
				fields: [
					{ name: 'Reason', value: ban.reason, inline: false },
					{ name: 'Moderator', value: 'Global Auto Ban', inline: false },
				],
			});
			await logChannel.send({ embeds: [logEmbed] }).catch(err => errorHandler(err));

			// Create the log data object
			const logData = {
				guildId: idGuild.guild.id,
				guildName: idGuild.guild.name,
				channelId: ban.guild.id,
				channelName: ban.guild.name,
				userId: ban.user.id,
				userTag: ban.user.username,
				modId: client.user.id,
				modTag: client.user.username,
				action: 'ban',
				reason: ban.reason,
				dmStatus,
				actionStatus,
			};

			// Save the log data to the database
			await log.create(logData).catch(err => errorHandler(err));
		}
	}
});

client.on(Events.GuildBanRemove, async (ban) => {
	if (ban.partial) {
		await ban.fetch().catch(err => errorHandler(err));
	}
	if (ban.user.partial) {
		await ban.user.fetch().catch(err => errorHandler(err));
	}
	if (ban.guild.id == '575762611111592007') {
		const idGuild = await client.guilds.fetch('1016585021651427370').catch(err => errorHandler(err));
		let actionStatus = false;
		const dmStatus = false;
		await idGuild.bans.remove(ban.user.id, { reason: ban.reason }).then(async () => {
			actionStatus = true;

			const logChannel = await idGuild.channels.fetch('1016585021651427370').catch(err => errorHandler(err));
			const logEmbed = embedBuilder({
				client,
				user: ban.user,
				title: 'Unban Log',
				description: `[${ban.user.id}] ${ban.user.username} has been **__unbanned__** from Global Server`,
				fields: [
					{ name: 'Reason', value: ban.reason, inline: false },
					{ name: 'Moderator', value: 'Global Auto Unban', inline: false },
				],
			});
			await logChannel.send({ embeds: [logEmbed] }).catch(err => errorHandler(err));

			// Create the log data object
			const logData = {
				guildId: idGuild.guild.id,
				guildName: idGuild.guild.name,
				channelId: ban.guild.id,
				channelName: ban.guild.name,
				userId: ban.user.id,
				userTag: ban.user.username,
				modId: client.user.id,
				modTag: client.user.username,
				action: 'unban',
				reason: ban.reason,
				dmStatus,
				actionStatus,
			};

			// Save the log data to the database
			await log.create(logData).catch(err => errorHandler(err));
		}).catch(err => errorHandler(err));
	}
});

client.once(Events.ClientReady, async () => {
	require('./scripts/restarts/deploy-commands');
	// require('./scripts/restarts/idbadwords')();
	require('./scripts/restarts/checkallmembers')(client);
	require('./scripts/restarts/message')(client);

	client.user.setPresence({
		status: 'online',
		activities: [{
			name: 'Sky: Anak-Anak Cahaya',
			type: ActivityType.Playing,
		}],
	});
	console.log('thatskybotid is Ready!');
});

client.login(S_TOKEN);

// Credits: Huntress of the Fallen