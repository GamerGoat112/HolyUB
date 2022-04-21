import proxyCompat from './proxy.json';

function compatible_proxy(src) {
	const { host } = new URL(src);

	for (let { domain, proxy } of proxyCompat.compatibility) {
		if (host === domain || host.endsWith(`.${domain}`)) {
			return proxy;
		}
	}

	return proxyCompat.default;
}

/**
 *
 * @param {string} src
 * @param {string} setting
 * @returns {string}
 */
export default function resolve_proxy(src, setting) {
	if (setting === 'auto') {
		setting = compatible_proxy(src);
	}

	switch (setting) {
		default:
		case 'rh':
			return `/proxies/rh.html#${src}`;
		case 'uv':
			return `/proxies/uv.html#${src}`;
		case 'st':
			return `/proxies/st.html#${src}`;
	}
}
