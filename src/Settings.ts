import { useEffect, useMemo, useRef, useState } from 'react';

export default class Settings<T> {
	private defaultSettings: T;
	private key: string;
	value: T;
	constructor(key: string, defaultSettings: T) {
		this.key = key;
		this.defaultSettings = defaultSettings;

		if (localStorage[this.key] === undefined) {
			localStorage[this.key] = '{}';
		}

		let parsed;

		try {
			parsed = JSON.parse(localStorage[this.key]);
		} catch (error) {
			parsed = {};
		}

		const settings: Partial<T> = {};
		Reflect.setPrototypeOf(settings, null);

		let updated = false;

		for (const key in this.defaultSettings) {
			if (this.validValue(key, parsed[key])) {
				settings[key] = parsed[key];
			} else {
				settings[key] = this.defaultSettings[key];
				updated = true;
			}
		}

		this.value = settings as T;

		if (updated) {
			localStorage[this.key] = JSON.stringify(this.value);
		}
	}
	validValue<K extends keyof T>(key: K, value: T[K]) {
		return typeof value === typeof this.defaultSettings[key];
	}
	get<K extends keyof T>(key: K): T[K] {
		return this.value[key];
	}
	setObject(object: { [K in keyof T]: T[K] }) {
		let updated = false;

		for (const key in object) {
			if (this.validValue(key, object[key])) {
				this.value[key] = object[key];
				updated = true;
			}
		}

		if (updated) localStorage[this.key] = JSON.stringify(this.value);

		return updated;
	}
	set<K extends keyof T>(key: K, value: T[K]) {
		if (typeof key === 'object') return this.setObject(key);

		if (!this.validValue(key, value)) return false;

		this.value[key] = value;
		localStorage[this.key] = JSON.stringify(this.value);
		return true;
	}
}

export function useSettings<T>(
	key: string,
	create: () => T
): [T, (state: T | ((prevState: T) => T)) => void] {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const settings = useMemo(() => new Settings(key, create()), []);
	const [current, setCurrent] = useState<{ [K in keyof T]: T[K] }>({
		...settings.value,
	});
	const oldCurrent = useRef(current);

	useEffect(() => {
		if (oldCurrent.current !== current) settings.setObject(current);
	}, [settings, current]);

	return [current, setCurrent];
}
