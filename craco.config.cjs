const WebpackObfuscator = require('webpack-obfuscator');
const { resolve, join } = require('path');
const { config } = require('dotenv');
const { cwd } = require('node:process');

config({ path: join(cwd(), '.env'), override: true });
config({ path: join(cwd(), '.env.local'), override: true });

if (process.env.NODE_ENV === 'production') {
	config({ path: join(cwd(), '.env.production'), override: true });
	config({ path: join(cwd(), '.env.production.local'), override: true });
} else {
	config({ path: join(cwd(), '.env.development'), override: true });
	config({ path: join(cwd(), '.env.development.local'), override: true });
}

module.exports = {
	webpack: {
		/**
		 *
		 * @param {import('webpack').Configuration} config
		 * @returns {import('webpack').Configuration}
		 */
		configure(config) {
			if (config.mode === 'production') {
				config.module.rules.push({
					test: /\.js$/,
					loader: 'string-replace-loader',
					options: {
						search: /process\.env\.(NODE_ENV|REACT_APP_ROUTER)/g,
						replace: (match, env) => JSON.stringify(process.env[env]),
					},
				});

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
