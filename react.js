/* eslint-disable no-inline-comments */
/* eslint-disable max-nested-callbacks */
module.exports = async (client) => {
	// await client.channels.fetch('1010443793578852402').then(async btch => {
	// 	const btmsg = await btch.messages.fetch('1030132957714845757').catch(err => console.error(err)); // Beta
	// 	await btmsg.reactions.removeAll().catch(err => console.error(err));
	// 	await btmsg.react('<:Beta:1029209258694299698>').catch(err => console.error(err));
	// }).catch(err => console.error(err));

	await client.channels.fetch('1010418851000885351').then(async ch => {
		const msg1 = await ch.messages.fetch('1029307083096592424').catch(err => console.error(err)); // Device
		const msg2 = await ch.messages.fetch('1029315656295907328').catch(err => console.error(err)); // Seasonal
		// const msg3 = await ch.messages.fetch('1029318143820185621').catch(err => console.error(err)); // Lifestyle

		// await msg1.reactions.removeAll().catch(err => console.error(err));
		// await msg2.reactions.removeAll().catch(err => console.error(err));
		// await msg3.reactions.removeAll().catch(err => console.error(err));

		// await msg1.react('🍎').then(async () => {
		// 	await msg1.react('🤖').then(async () => {
		// 		await msg1.react('🎮').then(async()=>{
		await msg1.react('🕹️').catch(err => console.error(err));
		//    }).catch(err => console.error(err));
		// 	}).catch(err => console.error(err));
		// }).catch(err => console.error(err));

		// await msg2.react('🙏').then(async () => {
		// 	await msg2.react('☔').then(async () => {
		// 		await msg2.react('🎀').then(async () => {
		// 			await msg2.react('❄').then(async () => {
		// 				await msg2.react('⛵').then(async () => {
		// 					await msg2.react('🏖').then(async () => {
		// 						await msg2.react('💠').then(async () => {
		// 							await msg2.react('⛸️').then(async () => {
		// 								await msg2.react('🎺').then(async () => {
		// 									await msg2.react('🦊').then(async () => {
		// 										await msg2.react('🕊').then(async () => {
		// 											await msg2.react('⚓').then(async () => {
		// 												await msg2.react('🎭').then(async () => {
		// 													await msg2.react('🌋').then(async () => {
		// 														await msg2.react('🌌').then(async ()=>{
		await msg2.react('🧣').catch(err => console.error(err));
		// 														}).catch(err => console.error(err));
		// 													}).catch(err => console.error(err));
		// 												}).catch(err => console.error(err));
		// 											}).catch(err => console.error(err));
		// 										}).catch(err => console.error(err));
		// 									}).catch(err => console.error(err));
		// 								}).catch(err => console.error(err));
		// 							}).catch(err => console.error(err));
		// 						}).catch(err => console.error(err));
		// 					}).catch(err => console.error(err));
		// 				}).catch(err => console.error(err));
		// 			}).catch(err => console.error(err));
		// 		}).catch(err => console.error(err));
		// 	}).catch(err => console.error(err));
		// }).catch(err => console.error(err));

		// 	await msg3.react('🎨').then(async () => {
		// 		await msg3.react('🎹').then(async () => {
		// 			await msg3.react('✈️').then(async () => {
		// 				await msg3.react('🚗').then(async () => {
		// 					await msg3.react('🦋').then(async () => {
		// 						await msg3.react('💪').then(async () => {
		// 							await msg3.react('🌗').then(async () => {
		// 								await msg3.react('🗺').then(async () => {
		// 									await msg3.react('🪐').then(async () => {
		// 										await msg3.react('📸').then(async () => {
		// 											await msg3.react('🛍').then(async () => {
		// 												await msg3.react('👶').then(async () => {
		// 													await msg3.react('🦐').then(async () => {
		// 														await msg3.react('👻').catch(err => console.error(err));
		// 													}).catch(err => console.error(err));
		// 												}).catch(err => console.error(err));
		// 											}).catch(err => console.error(err));
		// 										}).catch(err => console.error(err));
		// 									}).catch(err => console.error(err));
		// 								}).catch(err => console.error(err));
		// 							}).catch(err => console.error(err));
		// 						}).catch(err => console.error(err));
		// 					}).catch(err => console.error(err));
		// 				}).catch(err => console.error(err));
		// 			}).catch(err => console.error(err));
		// 		}).catch(err => console.error(err));
		// 	}).catch(err => console.error(err));
		// }).catch(err => console.error(err));
	});
};

// Credits: Huntress of the Fallen