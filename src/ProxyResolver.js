import { DB_API, DEFAULT_PROXY } from './root.js';
import { resolveRoute } from './Routes.js';

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

/**
 *
 * @param {string} src
 * @param {string} setting
 * @returns {string}
 */
export default async function resolve_proxy(src, setting) {
	if (setting === 'automatic') {
		const { host } = new URL(src);
		const api = new CompatAPI(DB_API);

		try {
			setting = (await api.compat(host)).proxy;
		} catch (error) {
			setting = DEFAULT_PROXY;
		}
	}

	let route;

	switch (setting) {
		case 'stomp':
			route = resolveRoute('/compat/', 'stomp');
			break;
		case 'ultraviolet':
			route = resolveRoute('/compat/', 'ultraviolet');
			break;
		default:
		case 'rammerhead':
			route = resolveRoute('/compat/', 'rammerhead');
			break;
	}

	return `${route}#${src}`;
}
