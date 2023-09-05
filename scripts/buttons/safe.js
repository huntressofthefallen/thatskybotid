module.exports = async (interaction) => {
	await interaction.message.edit({ content: `This message has been set as safe by ${interaction.user.tag}`, components: [] }).catch(err => console.error(err));
	await interaction.reply({ content: 'You have successfully marked this message as safe.', ephemeral: true }).catch(err => console.error(err));
};