import { Component } from 'react';
import obfuscate from '../../obfuscate.js';
import root from '../../root.js';
import ProxyHelper from '../../ProxyHelper.js';

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

export default class NotFound extends Component {
	scripts = new Map();
	helper = new ProxyHelper();
	load_script(src) {
		if (this.scripts.has(src)) {
			return Promise.resolve();
		}

		const script = document.createElement('script');
		script.src = src;
		script.async = true;

		const promise = new Promise((resolve, reject) => {
			script.addEventListener('load', () => {
				resolve();
			});

			script.addEventListener('error', () => {
				reject();
			});
		});

		document.body.append(script);

		this.scripts.set(src, script);

		return promise;
	}
	async componentDidMount() {
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

		this.helper.redirect(
			`${config.prefix}${config.encodeUrl(this.helper.destination)}`
		);
	}
	async componentWillUnmount() {
		for (let [src, script] of this.scripts) {
			script.remove();
			this.scripts.delete(src);
		}
	}
	render() {
		root.dataset.page = 'proxy-script';

		return (
			<>
				<main>
					<p>Your {obfuscate(<>proxy</>)} is loading...</p>
				</main>
			</>
		);
	}
}
