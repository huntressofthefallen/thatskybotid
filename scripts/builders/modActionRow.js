/**
 * @module ModActionRowBuilder
 */

const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Builds and returns an array containing two ActionRowBuilder instances
 * with components (StringSelectMenuBuilder and ButtonBuilder) added to them.
 *
 * @function
 * @returns {ActionRowBuilder[]} An array containing two ActionRowBuilder instances with components.
 */
module.exports = () => {
	const ModSelect = new StringSelectMenuBuilder()
		.setCustomId('mod')
		.setPlaceholder('Select a moderation option...')
		.setOptions(
			{
				label: 'Infraction Log',
				description: 'Check infraction log for this member.',
				value: 'log',
			},
			{
				label: 'Warning',
				description: 'Gives warning to this member.',
				value: 'warn',
			},
			{
				label: 'Mute 1 Hour',
				description: 'Mute this member for 1 hour.',
				value: 'mute1h',
			},
			{
				label: 'Mute 8 Hours',
				description: 'Mute this member for 8 hours.',
				value: 'mute8h',
			},
			{
				label: 'Mute 1 Day',
				description: 'Mute this member for 1 Day.',
				value: 'mute1d',
			},
			{
				label: 'Mute 2 Days',
				description: 'Mute this member for 2 Days.',
				value: 'mute2d',
			},
			{
				label: 'Mute 3 Days',
				description: 'Mute this member for 3 Days.',
				value: 'mute3d',
			},
			{
				label: 'Mute 7 Days',
				description: 'Mute this member for 7 Days.',
				value: 'mute7d',
			},
			{
				label: 'Unmute',
				description: 'Unmute this member.',
				value: 'unmute',
			},
			{
				label: 'Kick',
				description: 'Kick this member.',
				value: 'kick',
			},
			{
				label: 'Ban',
				description: 'Ban this member.',
				value: 'ban',
			},
			{
				label: 'Unban',
				description: 'Unban this member.',
				value: 'unban',
			},
		);

	const modactionrow = new ActionRowBuilder()
		.addComponents([ModSelect]);

	const DoneButt = new ButtonBuilder()
		.setCustomId('done')
		.setEmoji('✅')
		.setLabel('Set as Done')
		.setStyle(ButtonStyle.Success);

	const modactionrow2 = new ActionRowBuilder()
		.addComponents([DoneButt]);

	return [modactionrow, modactionrow2];
};

// Credits: Huntress of the Fallen