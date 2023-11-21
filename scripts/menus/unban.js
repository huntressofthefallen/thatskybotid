const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const { log } = require('../../database/lib/s');
const errorHandler = require('../src/errorHandler');

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
		description: `${member.user.username} has been unbanned.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.username, inline: false },
		],
	});

	// Perform the unban action
	try {
		await interaction.guild.bans.fetch(member.id).catch(err => errorHandler(err));
		await interaction.guild.bans.remove(member.id);
		actionStatus = true;
	}
	catch (err) {
		console.error(err.message);
	}

	// Send the log embed to the log channel
	const logChannel = await interaction.guild.channels.fetch('1016585021651427370').catch(err => errorHandler(err));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => errorHandler(err));

	// Edit the interaction reply with the log embed
	await interaction.message.edit({ content: `${member.user.username} has been unbanned.`, components: null }).catch(err => errorHandler(err));
	await interaction.editReply({ content: `${member.user.username} has been unbanned.`, ephemeral: options.hidden }).catch(err => errorHandler(err));

	// Create the log data object
	const logData = {
		guildId: interaction.guild.id,
		guildName: interaction.guild.name,
		channelId: interaction.channel.id,
		channelName: interaction.channel.name,
		userId: member.id,
		userTag: member.user.username,
		modId: interaction.user.id,
		modTag: interaction.user.username,
		action: 'unban',
		reason,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => errorHandler(err));
};

// Credits: Huntress of the Fallen