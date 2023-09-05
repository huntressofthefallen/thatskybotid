const { EmbedBuilder } = require('discord.js');

/**
 * Creates a Discord embed with the provided arguments.
 * @param {Object} options - The options for the embed.
 * @param {import('discord.js').Client} options.client - The Discord client instance.
 * @param {import('discord.js').User} options.user - The user for the embed footer.
 * @param {string} options.title - The title of the embed.
 * @param {string} options.description - The description of the embed.
 * @param {Array<{ name: string, value: string, inline?: boolean }>} [options.fields=[]] - An array of fields to add to the embed.
 * @param {string} [options.image=null] - An optional image URL to add to the embed.
 * @param {string} [options.url=null] - An optional title URL to add to the embed.
 * @returns {import('discord.js').EmbedBuilder} - The created Discord embed.
 */
module.exports = (options) => {
	const { client, user, title = null, description = null, fields = [], image = null, url = null } = options;

	const embed = new EmbedBuilder()
		.setTitle(title)
		.setDescription(description)
		.setFields(fields)
		.setImage(image)
		.setURL(url)
		.setFooter({ text: user.id, iconURL: user.displayAvatarURL() })
		.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid', iconURL: client.user.displayAvatarURL() })
		.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
		.setColor('Random')
		.setTimestamp();

	return embed;
};

// Credits: Huntress of the Fallen