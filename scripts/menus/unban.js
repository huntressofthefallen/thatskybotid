const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const { log } = require('../../database/lib/s');

/**
 * Unban a user
 * @param {import('discord.js').StringSelectMenuInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the unban action.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral or not.
 */
module.exports = async (interaction, options) => {
	// Fetch the member object from the interaction
	const embed = interaction.message.embeds[0];
	const memberId = embed.footer.text;
	const member = await interaction.guild.members.fetch(memberId);

	// Extract the reason from the embed fields
	let reason;
	embed.fields.forEach(field => {
		if (field.name === 'Reason') {
			reason = field.value;
		}
	});

	let actionStatus = false;

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client: interaction.client,
		user: member.user,
		title: 'Unban Log',
		description: `${member.user.tag} has been unbanned.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.tag, inline: false },
		],
	});

	// Perform the unban action
	try {
		await interaction.guild.bans.fetch(member.id).catch(err => console.error(err));
		await interaction.guild.bans.remove(member.id);
		actionStatus = true;
	}
	catch (err) {
		console.error(err);
	}

	// Send the log embed to the log channel
	const logChannel = await interaction.guild.channels.fetch('1016585021651427370').catch(err => console.error(err));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => console.error(err));

	// Edit the interaction reply with the log embed
	await interaction.message.edit({ content: `${member.user.tag} has been unbanned.`, components: null }).catch(err => console.error(err));
	await interaction.editReply({ content: `${member.user.tag} has been unbanned.`, ephemeral: options.hidden }).catch(err => console.error(err));

	// Create the log data object
	const logData = {
		guildId: interaction.guild.id,
		guildName: interaction.guild.name,
		channelId: interaction.channel.id,
		channelName: interaction.channel.name,
		userId: member.id,
		userTag: member.user.tag,
		modId: interaction.user.id,
		modTag: interaction.user.tag,
		action: 'unban',
		reason,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => console.error(err));
};

// Credits: Huntress of the Fallen