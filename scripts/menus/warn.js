const embedBuilder = require('../builders/embed');
const modActionRowBuilder = require('../builders/modActionRow');
const { log } = require('../../database/lib/s');

/**
 * Warns a user from the server and logs the warn action.
 * @param {import('discord.js').StringSelectMenuInteraction} interaction - The interaction that triggered the command.
 * @param {Object} options - The options for the ban action.
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
		description: `Kamu mendapatkan peringatan dari server ${interaction.guild.name} dengan alasan **__${reason}__**\n\nKami mengutamakan keamanan dan kenyamanan para pemain, mohon membaca kembali peraturan di server discord kami sebelum bergabung kembali bersama para pemain lainnya.`,
	});

	// Create the embed to be sent to the log channel
	const logEmbed = embedBuilder({
		client: interaction.client,
		user: member.user,
		title: 'Warn Log',
		description: `${member.user.tag} has been warned.`,
		fields: [
			{ name: 'Reason', value: reason, inline: false },
			{ name: 'Moderator', value: interaction.user.tag, inline: false },
		],
	});


	// Send the DM to the User
	await member.send({ embeds: [dmEmbed] }).then(() => {
		dmStatus = true;
		actionStatus = true;
	}).catch(err => console.error(err));

	// Send the log embed to the log channel
	const logChannel = await interaction.guild.channels.fetch('1016584900444430417').catch(err => console.error(err));
	await logChannel.send({ embeds: [logEmbed], components: modActionRowBuilder() }).catch(err => console.error(err));

	// Edit the interaction reply with the log embed
	await interaction.message.edit({ content: `${member.user.tag} has been warned.`, components: null }).catch(err => console.error(err));
	await interaction.editReply({ content: `${member.user.tag} has been warned.`, ephemeral: options.hidden }).catch(err => console.error(err));

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
		action: 'warning',
		reason,
		dmStatus,
		actionStatus,
	};

	// Save the log data to the database
	await log.create(logData).catch(err => console.error(err));
};

// Credits: Huntress of the Fallen