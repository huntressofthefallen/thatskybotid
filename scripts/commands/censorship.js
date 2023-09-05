const updateCensoredWords = require('../src/updateCensoredWords');
const updateWhitelistWords = require('../src/updateWhitelistWords');
const deleteCensoredWords = require('../src/deleteCensoredWords');
const deleteWhitelistWords = require('../src/deleteWhitelistWords');

/**
 * Handles censorship word actions, including adding new words, editing existing words, removing words, and whitelisting.
 * @param {import('discord.js').ChatInputCommandInteraction} interaction - The interaction object.
 * @param {Object} options - Additional options for the censorship action.
 * @param {boolean} options.hidden - Whether the reply should be ephemeral (visible only to the user who invoked the command).
 * @returns {Promise<void>}
 */
module.exports = async (interaction, options) => {
	const subcommand = interaction.options.getSubcommand();
	const word = interaction.options.getString('word').toLowerCase();
	const args = word.trim().split(/ +/);

	if (args[1]) {
		await interaction.editReply({ content: `Error 403 - ${word} should be only 1 word.`, ephemeral: options.hidden }).catch(err => console.error(err));
		return;
	}

	if (subcommand === 'add' || subcommand === 'edit') {
		const automod = interaction.options.getString('automod');
		const censoredWord = {
			word,
			automod: automod === 'auto',
			category: automod === 'auto' ? 1 : 2,
		};
		await updateCensoredWords(interaction.guild.id, [censoredWord]);

		const response = automod === 'auto'
			? `${word} - has been successfully updated in the Auto Mod Database.`
			: automod === 'manual'
				? `${word} - has been successfully updated in the Manual Mod Database.`
				: 'Error 404 - Command not found.';

		await interaction.editReply({ content: response, ephemeral: options.hidden }).catch(err => console.error(err));
	}
	else if (subcommand === 'remove') {
		const category = interaction.options.getString('category');
		if (category === 'whitelist') {
			await deleteWhitelistWords(interaction.guild.id, [word]);
		}
		else {
			await deleteCensoredWords(interaction.guild.id, [word]);
		}

		const response = category === 'whitelist'
			? `${word} - has been successfully deleted in the Whitelist Database.`
			: `${word} - has been successfully deleted in the Censorship Database.`;

		await interaction.editReply({ content: response, ephemeral: options.hidden }).catch(err => console.error(err));
	}
	else if (subcommand === 'whitelist') {
		await updateWhitelistWords(interaction.guildId, [word]);
		await interaction.editReply({ content: `${word} - has been successfully updated in the Whitelist Database.`, ephemeral: options.hidden }).catch(err => console.error(err));
	}
	else {
		await interaction.editReply({ content: 'Error 404 - Command not found.', ephemeral: true }).catch(err => console.error(err));
	}
};

// Credits: Huntress of the Fallen