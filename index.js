require('dotenv').config();
const { ClusterManager, HeartbeatManager } = require('discord-hybrid-sharding');
const { S_TOKEN } = process.env;
const botList = [
	{ file: './bot.js', token: S_TOKEN, name: 'thatskybotid' },
];

botList.forEach(bot => {
	const manager = new ClusterManager(bot.file, {
		totalShards: 'auto',
		totalClusters: 'auto',
		mode: 'process',
		token: bot.token,
	});
	manager.extend(
		new HeartbeatManager({
			interval: 2000,
			maxMissedHeartbeats: 5,
		}),
	);

	manager.on('clusterCreate', cluster => console.log(`Launched Cluster ${cluster.id} (${bot.name})`));
	manager.spawn({ timeout: -1 });
});

// Credits: Huntress of the Fallen