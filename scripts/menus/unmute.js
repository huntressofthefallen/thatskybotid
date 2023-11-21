const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const { log } = require('../../database/lib/s');
const errorHandler = require('../src/errorHandler');

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
		title: 'Mute Log',
		description: `${member.user.username} has been muted.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.username, inline: false },
		],
	});

	try {
		await member.timeout(null, `${reason}`);
		actionStatus = true;
	}
	catch (err) {
		console.error(err.message);
	}

	// Send the log embed to the log channel
	const logChannel = await interaction.guild.channels.fetch('1016584981147045979').catch(err => errorHandler(err));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => errorHandler(err));

	// Edit the interaction reply with the log embed
	await interaction.message.edit({ content: `${member.user.username} has been muted.`, components: null }).catch(err => errorHandler(err));
	await interaction.editReply({ content: `${member.user.username} has been muted.`, ephemeral: options.hidden }).catch(err => errorHandler(err));

	// Create the log data object
	const logData = {
		guildId: interaction.guild.id,
		guildName: interaction.guild.name,
		channelId: interaction.channel.id,
		channelName: interaction.channel.name,
		userId: member.user.id,
		userTag: member.user.username,
		modId: interaction.user.id,
		modTag: interaction.user.username,
		action: 'unmute',
		reason,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => errorHandler(err));
};

// Credits: Huntress of the Fallen