/**
 * @module UserActionRowBuilder
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Builds and returns an array containing two ActionRowBuilder instances
 * with components (StringSelectMenuBuilder and ButtonBuilder) added to them.
 *
 * @function
 * @returns {ActionRowBuilder[]} An array containing two ActionRowBuilder instances with components.
 */
module.exports = () => {
	const translateButton = new ButtonBuilder()
		.setCustomId('translate')
		.setLabel('Translate to English')
		.setStyle(ButtonStyle.Primary);

	const translateactionrow = new ActionRowBuilder()
		.addComponents([translateButton]);

	return [translateactionrow];
};

// Credits: Huntress of the Fallen