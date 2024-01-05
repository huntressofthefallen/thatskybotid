require('dotenv').config();
const axios = require('axios');

module.exports = async (text, { to }) => {
	const response = await axios.post(
		'https://api-free.deepl.com/v2/translate',
		{
			'text': [
				text,
			],
			'target_lang': to,
		},
		{
			headers: {
				'Authorization': `DeepL-Auth-Key ${process.env.DEEPLAUTH}`,
				'Content-Type': 'application/json',
			},
		},
	);
	return response;
};