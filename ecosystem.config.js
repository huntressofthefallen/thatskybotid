module.exports = {
	apps: [
		{
			name: 'thatskybotid',
			script: './index.js',
			max_memory_restart: '1G',
			watch: false,
			exec_mode: 'fork_mode',
			cron_restart: '5 0 * * *',
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};