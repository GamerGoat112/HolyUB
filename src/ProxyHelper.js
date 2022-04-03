export default class ProxyHelper {
	get destination() {
		const { hash } = global.location;

		if (hash === '') {
			throw new Error('No hash was provided');
		}

		return new URL(hash.slice(1));
	}
	redirect(url) {
		global.location.assign(url);
	}
}
