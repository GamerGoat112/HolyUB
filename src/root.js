import process from 'process';

let _BARE_API;
let _RH_APP;
let _DB_API;
let _HCAPTCHA_KEY;

if (process.env.NODE_ENV === 'development') {
	_BARE_API = 'http://localhost:8001/';
	_RH_APP = 'http://localhost:8002/';
	_DB_API = 'http://localhost:3001/';
	_HCAPTCHA_KEY = '10000000-ffff-ffff-ffff-000000000001';
} else {
	const { host } = global.location;
	_BARE_API = `https://uv.${host}/`;
	_RH_APP = `https://rh.${host}/`;
	_DB_API = new URL('/db/', global.location);
	_HCAPTCHA_KEY = 'e4953837-586a-40af-b26c-4e0c92b6ee13';
}

/*Test Key Set: Publisher Account

Test parameter Value

Site Key 10000000-ffff-ffff-ffff-000000000001 Secret Key 0x0000000000000000000000000000000000000000*/

export const BARE_API = _BARE_API;
export const RH_APP = _RH_APP;
export const DB_API = _DB_API;
export const HCAPTCHA_KEY = _HCAPTCHA_KEY;

export const DEFAULT_PROXY = 'ultraviolet';
export const GAMES_CDN = new URL('/games/', global.location);

export default document.querySelector('#root');

export function set_page(page) {
	document.documentElement.dataset.page = page;
}

export function get_page(page) {
	return document.documentElement.dataset.page;
}
