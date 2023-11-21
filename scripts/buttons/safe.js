const errorHandler = require('../src/errorHandler');

module.exports = async (interaction) => {
	await interaction.message.edit({ content: `This message has been set as safe by ${interaction.user.username}`, components: [] }).catch(err => errorHandler(err));
	await interaction.reply({ content: 'You have successfully marked this message as safe.', ephemeral: true }).catch(err => errorHandler(err));
};