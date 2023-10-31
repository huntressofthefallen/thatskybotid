const embedBuilder = require('../builders/embed');

/**
 * Handles the interaction to display the infraction log.
 * @param {import("discord.js").StringSelectMenuInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the interaction reply.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	// Fetch the member object from the interaction
	const embed = interaction.message.embeds[0];
	const memberId = embed.footer.text;
	const member = await interaction.guild.members.fetch(memberId);

	const responseEmbed = embedBuilder({
		client: interaction.client,
		user: member.user,
		title: 'Infraction Log',
		description: '[Click Here to See the Infraction Logs](https://community.funplus.com/)',
	});

	await interaction.editReply({ embeds: [responseEmbed], ephemeral: options.hidden }).catch(err => console.error(err.message));
};

// Credits: Huntress of the Fallen