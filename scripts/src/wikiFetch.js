const fetch = require('node-fetch-commonjs');
const { ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ButtonBuilder, ButtonStyle } = require('discord.js');
const embedBuilder = require('../builders/embed');
const timeout = 600000;

module.exports = async (interaction, keywords) => {
	let url = 'https://sky-children-of-the-light.fandom.com/api.php';

	const params = {
		action: 'opensearch',
		search: keywords,
		limit: '10',
		format: 'json',
	};

	url = url + '?origin=*';
	Object.keys(params).forEach((key) => { url += '&' + key + '=' + params[key]; });

	await fetch(url).then(async (response) => {
		const res = await response.json();
		if (res[1].length > 0) {
			respondmessage(interaction, res);
		}
		else {
			await interaction.editReply({ content: `There is no search result for \`${keywords.replace(/%20/gi, ' ')}\` in Sky: Children of the Light page. Please try again with different keywords.` }).catch(err => console.error(err));
		}
	}).catch((err) => { console.error(err); });
};

async function respondmessage(interaction, res) {
	const embed = embedBuilder({
		client: interaction.client,
		user: interaction.user,
		title: 'Sky: Children of the Light Wiki Search Results',
		url: 'https://sky-children-of-the-light.fandom.com/wiki/Sky:_Children_of_the_Light_Wiki',
		description: 'Please select the menu below to see a wiki page.',
	});

	const menudata = [];
	const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
	res[1].forEach((r, i) => {
		menudata.push({ label: r, desc: res[3][i], value: r, emoji: emojis[i] });
	});

	dropdownPages(interaction, {
		type: 2,
		embed: embed,
		placeHolder: 'Select a Wiki Page',
		data: menudata,
	});
}

async function dropdownPages(interaction, options = []) {
	const data = options.data;
	const menuOptions = [];

	for (let i = 0; i < data.length; i++) {
		if (data[i].emoji) {
			const dataopt = {
				label: data[i].label,
				description: data[i].desc.slice(0, 99),
				value: data[i].label,
				emoji: data[i].emoji,
			};
			menuOptions.push(dataopt);
		}
		else if (!data[i].emoji) {
			const dataopt = {
				label: data[i].label,
				description: data[i].desc.slice(0, 99),
				value: data[i].label,
			};
			menuOptions.push(dataopt);
		}
	}
	const slct = new StringSelectMenuBuilder()
		.setMaxValues(1)
		.setCustomId('wiki')
		.setPlaceholder(options.placeHolder || 'Dropdown Pages')
		.addOptions(menuOptions);

	const row = new ActionRowBuilder()
		.addComponents([slct]);

	await interaction.editReply({ embeds: [options.embed], components: [row] }).then(m => {
		awaitmessagecomp(m, interaction, data);
	});
}

async function awaitmessagecomp(m, interaction, data) {
	m.awaitMessageComponent({ componentType: ComponentType.StringSelect, time: timeout }).then(async (menu) => {
		if (menu.user.id == interaction.user.id) {
			const selet = menu.values[0];
			for (let i = 0; i < data.length; i++) {
				if (selet === data[i].label) {
					const btn = new ButtonBuilder()
						.setLabel('View in Wiki')
						.setURL(data[i].desc)
						.setStyle(ButtonStyle.Link);

					const actrow = new ActionRowBuilder()
						.addComponents([btn]);

					await menu.deferUpdate().catch(err => console.error(err));
					await menu.editReply({ content: data[i].desc, embeds: [], components: [actrow] }).catch(err => console.error(err));
				}
			}
		}
		else {
			await menu.deferReply({ ephemeral: true }).catch(err => console.error(err));
			await menu.editReply({ content: 'This message was triggered by someone else. Please run a new command to use the button.', ephemeral: true }).catch(err => console.error(err));
		}
	}).catch(async () => {
		await m.edit({ components: [] }).catch(err => console.error(err));
	});
}

// Credits: Huntress of the Fallen