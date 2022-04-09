/**
 * @typedef {bool|string|Serializable{}|object.<string, Serializable>|undefined} Serializable
 */
export default class Settings {
	/**
	 *
	 * @param {string} key
	 * @param {object.<string, Serializable>} default_settings
	 */
	constructor(key, default_settings) {
		this.key = key;
		this.default_settings = default_settings;
		this.value = this.load();
	}
	load() {
		if (localStorage[this.key] === undefined) {
			localStorage[this.key] = '{}';
		}

		let parsed;

		try {
			parsed = JSON.parse(localStorage[this.key]);
		} catch (error) {
			parsed = {};
		}

		const settings = {};
		Reflect.setPrototypeOf(settings, null);

		let update = false;

		for (let key in this.default_settings) {
			if (this.valid_value(key, parsed[key])) {
				settings[key] = parsed[key];
			} else {
				update = true;
			}
		}

		if (update) {
			localStorage[this.key] = JSON.stringify(this.value);
		}

		return settings;
	}
	valid_value(key, value) {
		return typeof value === typeof this.default_settings[key];
	}
	get(key) {
		return this.value[key];
	}
	set(key, value) {
		console.log(key, value, this.valid_value(key, value));
		if (this.valid_value(key, value)) {
			this.value[key] = value;
			localStorage[this.key] = JSON.stringify(this.value);
			return true;
		} else {
			return false;
		}
	}
}
