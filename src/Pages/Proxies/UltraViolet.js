import ProxyModule from '../../ProxyModule.js';

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

export default class UltraViolet extends ProxyModule {
	async _componentDidMount() {
		await this.load_script('/uv/uv.bundle.js');
		await this.load_script('/uv/uv.config.js');
		/**
		 * @type {UVConfig}
		 */
		const config = global.__uv$config;

		// register sw
		await navigator.serviceWorker.register('/uv/sw.js', {
			scope: config.prefix,
			// cache sucks
			// we have plenty of bandwidth to spare
			updateViaCache: 'none',
		});

		this.redirect(
			new URL(
				config.encodeUrl(this.destination),
				new URL(config.prefix, global.location)
			)
		);
	}
}
