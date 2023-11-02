const embedBuilder = require('../builders/embed');
const getLatestLogs = require('../src/getLatestLogs');

/**
 * Handles the interaction to display the infraction log.
 * @param {import("discord.js").ChatInputCommandInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	const userId = interaction.options.getUser('user').id;
	const description = await getLatestLogs(userId);

	const embed = embedBuilder({
		client: interaction.client,
		user: interaction.user,
		title: 'Infraction Log',
		description,
	});

	await interaction.editReply({ embeds: [embed], ephemeral: options.hidden }).catch(err => console.error(err.message));
};

// Credits: Huntress of the Fallen