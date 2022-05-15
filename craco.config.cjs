const WebpackObfuscator = require('webpack-obfuscator');
const { resolve } = require('path');
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
					exclude: [resolve(__dirname, 'node_modules')],
					use: {
						loader: WebpackObfuscator.loader,
						options: {
							compact: true,
							controlFlowFlattening: false,
							deadCodeInjection: false,
							debugProtection: false,
							debugProtectionInterval: 0,
							disableConsoleOutput: false,
							identifierNamesGenerator: 'mangled',
							log: false,
							stringArray: true,
							stringArrayEncoding: ['base64'],
							stringArrayIndexShift: false,
							stringArrayRotate: false,
							stringArrayShuffle: false,
							stringArrayWrappersCount: 1,
							stringArrayWrappersChainedCalls: true,
							stringArrayWrappersParametersMaxCount: 2,
							stringArrayWrappersType: 'variable',
							stringArrayThreshold: 1,
							unicodeEscapeSequence: false,
						},
					},
				});
			}

			return config;
		},
	},
};
