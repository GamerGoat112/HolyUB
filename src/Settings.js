import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * @typedef {bool|string|Serializable{}|object.<string, Serializable>|undefined} Serializable
 */
export default class Settings {
	value = {};
	/**
	 *
	 * @param {string} key
	 * @param {object.<string, Serializable>} default_settings
	 * @param {import('react').Component} component
	 */
	constructor(key, default_settings) {
		this.key = key;
		this.default_settings = default_settings;
		this.load();
		Reflect.setPrototypeOf(this.value, null);
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

		this.set_object(parsed);
	}
	valid_value(key, value) {
		return typeof value === typeof this.default_settings[key];
	}
	get(key) {
		return this.value[key];
	}
	set_object(object) {
		let updated = false;

		for (let key in object) {
			if (this.valid_value(key, object[key])) {
				this.value[key] = object[key];
				updated = true;
			}
		}

		if (updated) {
			localStorage[this.key] = JSON.stringify(this.value);
		}

		return updated;
	}
	set(key, value) {
		if (typeof key === 'object') {
			this.set_object(key);
			return;
		}

		if (this.valid_value(key, value)) {
			this.value[key] = value;
			localStorage[this.key] = JSON.stringify(this.value);
			if (this.component !== undefined) {
				this.component.forceUpdate();
			}
			return true;
		} else {
			return false;
		}
	}
}

export function useSettings(key, create) {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const settings = useMemo(() => new Settings(key, create()), []);
	const [current, set_current] = useState({ ...settings.value });
	const old_current = useRef(current);

	useEffect(() => {
		if (old_current.current !== current) {
			settings.set(current);
		}
	}, [settings, current]);

	return [current, set_current];
}
