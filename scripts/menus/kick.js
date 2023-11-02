const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const userActionRowBuilder = require('../builders/userActionRow');
const { log } = require('../../database/lib/s');

/**
 * Kicks a user from the server and logs the kick action.
 * @param {import('discord.js').StringSelectMenuInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the kick action.
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

	let dmStatus = false;
	let actionStatus = false;

	// Create the embed to be sent to the user via DM
	const dmEmbed = embedBuilder({
		client: interaction.client,
		user: member.user,
		title: `Halo ${member.user.username},`,
		description: `Kamu telah dikeluarkan dari ${interaction.guild.name} dengan alasan ${reason}\n\nKami mengutamakan keamanan dan kenyamanan para pemain, mohon membaca kembali peraturan di server discord kami sebelum bergabung kembali bersama kami.`,
	});

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client: interaction.client,
		user: member.user,
		title: 'Kick Log',
		description: `${member.user.tag} has been kicked.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.tag, inline: false },
		],
	});

	// Send the DM to the User
	await member.send({ embeds: [dmEmbed], components: userActionRowBuilder() }).then(() => { dmStatus = true; }).catch(err => console.error(err.message));

	// Check if the member is kickable and perform the kick action
	if (member.kickable) {
		try {
			await member.timeout(7 * 24 * 60 * 60 * 1000, `${reason}`).catch(err => console.error(err.message));
			await member.kick({ reason });
			actionStatus = true;
		}
		catch (err) {
			console.error(err.message);
		}
	}

	// Send the log embed to the log channel
	const logChannel = await interaction.guild.channels.fetch('1027205248663687249').catch(err => console.error(err.message));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => console.error(err.message));

	// Edit the interaction reply with the log embed
	await interaction.message.edit({ content: `${member.user.tag} has been kicked.`, components: null }).catch(err => console.error(err.message));
	await interaction.editReply({ content: `${member.user.tag} has been kicked.`, ephemeral: options.hidden }).catch(err => console.error(err.message));

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
		action: 'kick',
		reason,
		dmStatus,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => console.error(err.message));
};

// Credits: Huntress of the Fallen