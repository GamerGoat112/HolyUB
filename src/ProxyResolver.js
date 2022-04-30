import { DB_API, DEFAULT_PROXY } from './root.js';

export class CompatAPI {
	constructor(server) {
		this.server = server;
	}
	async compat(host) {
		const outgoing = await fetch(new URL(`./compat/${host}/`, this.server));

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
	async game_plays(id, token) {
		const outgoing = await fetch(
			new URL(
				`./games/${id}/plays?` +
					new URLSearchParams({
						token,
					}),
				this.server
			),
			{
				method: 'PUT',
			}
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
	sort_params(params) {
		for (let param in params) {
			switch (typeof params[param]) {
				case 'undefined':
				case 'object':
					delete params[param];
					break;
				// no default
			}
		}

		return params;
	}
	/**
	 *
	 * @param {GamesCategoryParams} params
	 * @param {AbortSignal} signal
	 * @returns {GamesCategory}
	 */
	async category(params, signal) {
		const outgoing = await fetch(
			new URL(
				'./games/?' + new URLSearchParams(this.sort_params(params)),
				this.server
			),
			{ signal }
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
}

function compatible_proxy(src) {
	const { host } = new URL(src);
	const api = new CompatAPI(DB_API);

	try {
		return api.compat(host);
	} catch (error) {
		return DEFAULT_PROXY;
	}
}

/**
 *
 * @param {string} src
 * @param {string} setting
 * @returns {string}
 */
export default async function resolve_proxy(src, setting) {
	if (setting === 'auto') {
		setting = compatible_proxy(src);
	}

	switch (setting) {
		default:
		case 'rammerhead':
			return `/proxies/rh.html#${src}`;
		case 'ultraviolet':
			return `/proxies/uv.html#${src}`;
		case 'stomp':
			return `/proxies/st.html#${src}`;
	}
}
