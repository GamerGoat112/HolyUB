const { resolve } = require('path');
const WebpackObfuscator = require('webpack-obfuscator');
const { EnvironmentPlugin } = require('webpack');

module.exports = {
	webpack: {
		/**
		 *
		 * @param {import('webpack').Configuration} config
		 * @returns {import('webpack').Configuration}
		 */
		configure(config) {
			config.plugins.push(
				new EnvironmentPlugin(['NODE_ENV', 'REACT_APP_ROUTER'])
			);
			config.module.rules.push({
				test: /\.js$/,
				loader: 'string-replace-loader',
				options: {
					search: /process.env.(NODE_ENV|REACT_APP_ROUTER)/g,
					replace: (match, env) => JSON.stringify(process.env[env]),
				},
			});

			if (config.mode === 'production') {
				config.module.rules.push({
					test: /\.js$/,
					enforce: 'post',
					exclude: [
						resolve(__dirname, 'node_modules'),
						resolve(__dirname, 'src', 'App.js'),
					],
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
