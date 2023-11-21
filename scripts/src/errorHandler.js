const { WebhookClient, EmbedBuilder } = require('discord.js');

/**
 * Handles an error by logging it to the console in a more informative way.
 * @param {Error} err The error to be handled
 */
const handleError = async (err) => {
	const { message, name, stack } = err;
	const timestamp = new Date().toISOString();
	const errorMessage = `[${timestamp}] Error: ${name}\nMessage: ${message}\nStack Trace:\n${stack}`;
	console.error(errorMessage);

	const webhookClient = new WebhookClient({ id: '1176553682200957098', token: 'Cz7Y12t-rrcQV9WmjNFAj-JpCVYilYWgjSRREMzJMpUT67hQ26y6fZtDShBLnKFgaXmA' });
	const embed = new EmbedBuilder()
		.setTitle(`Error: ${name}`)
		.setDescription(`- **Message:** ${message}\n- **Stack Trace:**\n${stack}`)
		.setFooter({ text: `Error: ${name}` })
		.setAuthor({ name: 'thatskybotid', url: 'https://bit.ly/m/thatskygameid' })
		.setThumbnail('https://img2.storyblok.com/fit-in/0x300/filters:format(webp)/f/108104/368x415/436d2e239c/sky-logo-white.png')
		.setColor('Random')
		.setTimestamp();

	await webhookClient.send({ embeds: [embed] }).catch(console.error);
};

module.exports = handleError;