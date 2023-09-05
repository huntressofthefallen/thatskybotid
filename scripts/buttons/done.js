module.exports = async (interaction) => {
	await interaction.message.edit({ content: `This message has been set as done by ${interaction.user.tag}`, components: [] }).catch(err => console.error(err));
	await interaction.reply({ content: 'You have successfully marked this message as done.', ephemeral: true }).catch(err => console.error(err));
};