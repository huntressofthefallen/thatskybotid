const checkEscalation = require('../src/checkEscalation');
const ban = require('./ban');
const warning = require('./warn');
const kick = require('./kick');
const mute = require('./mute');

/**
 * Perform the next escalation step based on the user's recent infractions.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - Additional options for the escalation action
 */
module.exports = async (interaction, options) => {
	const userId = interaction.options.getUser('user').id;
	const guildId = interaction.guild.id;

	const escalation = await checkEscalation(userId, guildId);

	if (!escalation) {
		await warning(interaction, options);
		await interaction.editReply({ content: 'An error occurred while processing the escalation step.', ephemeral: true }).catch(err => console.error(err));
		return;
	}

	switch (escalation.action) {
		case 'ban':
			await ban(interaction, options);
			break;
		case 'warning':
			await warning(interaction, options);
			break;
		case 'kick':
			await kick(interaction, options);
			break;
		case 'mute':
			options.duration = escalation.duration;
			await mute(interaction, options);
			break;
		default:
			await warning(interaction, options);
			break;
	}
};

// Credits: Huntress of the Fallen