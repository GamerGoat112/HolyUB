import { DB_API, DEFAULT_PROXY } from './root.js';
import CompatAPI from './CompatAPI.js';
import resolveRoute from './resolveRoute.js';

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
