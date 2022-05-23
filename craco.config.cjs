const { join } = require('path');
require('react-scripts/config/env.js');

const env = ['NODE_ENV', 'REACT_APP_ROUTER', 'REACT_APP_HAT_BADGE'];

/*console.log(
	Object.fromEntries(env.concat('BROWSER').map(env => [env, process.env[env]]))
);*/

module.exports = {
	webpack: {
		/**
		 *
		 * @param {import('webpack').Configuration} config
		 * @returns {import('webpack').Configuration}
		 */
		configure(config) {
			config.module.rules.push({
				test: /\.js$/,
				loader: 'string-replace-loader',
				options: {
					search: /process\.env\.(\w+)/g,
					replace: (match, menv) => {
						if (env.includes(menv)) {
							return JSON.stringify(process.env[menv]);
						} else {
							return match;
						}
					},
				},
			});

			if (config.mode === 'production') {
				config.module.rules.push({
					test: /\.js$/,
					enforce: 'post',
					exclude: [join(__dirname, 'node_modules')],
					use: {
						loader: join(__dirname, 'strings', 'loader.js'),
						options: {
							salt: 9185,
						},
					},
				});
			}

			return config;
		},
	},
};
