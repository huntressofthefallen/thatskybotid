const { EmbedBuilder } = require('discord.js');
const errorHandler = require('../src/errorHandler');

module.exports = async (client) => {
  const embed = new EmbedBuilder()
    .setTitle(`Restart Notification`)
    .setDescription(`The bot has been restarted successfully.`)
    .setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid' })
    .setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
    .setColor('Random')
    .setTimestamp();

  const guild = await client.guilds.fetch('1009644872065613864').catch(err => errorHandler(err));
  const channel = await guild.channels.fetch('1027192744080314420').catch(err => errorHandler(err));
  await channel.send({ embeds: [embed] }).catch(err => errorHandler(err));
};