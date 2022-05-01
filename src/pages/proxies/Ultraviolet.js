import ProxyModule from '../../ProxyModule.js';
import { BARE_API } from '../../root.js';

/**
 * @callback UVEncode
 * @argument {string} decoded
 * @returns {string} encoded
 */

/**
 * @callback UVDecode
 * @argument {string} encoded
 * @returns {string} decoded
 */

/**
 * @typedef {object} UVConfig
 * @property {string} bare
 * @property {string} handler
 * @property {string} bundle
 * @property {string} config
 * @property {string} sw
 * @property {UVEncode} encodeUrl
 * @property {UVDecode} decodeUrl
 */

export default class Ultraviolet extends ProxyModule {
	name = 'Ultraviolet';
	async _componentDidMount() {
		await this.possible_error('Failure loading the Ultraviolet bundle.');
		await this.load_script('/uv/uv.bundle.js');
		await this.possible_error('Failure loading the Ultraviolet config.');
		await this.load_script('/uv/uv.config.js');
		await this.possible_error();

		/**
		 * @type {UVConfig}
		 */
		const config = global.__uv$config;

		// register sw
		this.possible_error('Failure registering the UltraViolet Service Worker.');
		await navigator.serviceWorker.register('/uv/sw.js', {
			scope: config.prefix,
			// cache sucks
			// we have plenty of bandwidth to spare
			updateViaCache: 'none',
		});
		await this.possible_error();

		await this.possible_error('Bare server is unreachable.');
		{
			const bare = await fetch(BARE_API);
			if (!bare.ok) {
				throw await bare.json();
			}
		}
		await this.possible_error();

		this.redirect(
			new URL(
				config.encodeUrl(this.destination),
				new URL(config.prefix, global.location)
			)
		);
	}
}
