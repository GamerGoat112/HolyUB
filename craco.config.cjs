const WebpackObfuscator = require('webpack-obfuscator');
const { resolve } = require('path');

module.exports = {
	webpack: {
		configure(config) {
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
