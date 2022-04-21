import process from 'process';

document.title = 'Holy Unblocker';

let _bareCDN;
let _rhApp;
let _gamesAPI;
let _hcaptchaKey;

if (process.env.NODE_ENV === 'development') {
	_bareCDN = 'http://localhost:8001/';
	_rhApp = 'http://localhost:8002/';
	_gamesAPI = 'http://localhost:3001/';
	_hcaptchaKey = '10000000-ffff-ffff-ffff-000000000001';
} else {
	const { host } = global.location;
	_bareCDN = `https://uv.${host}/bare/`;
	_rhApp = `https://rh.${host}/`;
	_gamesAPI = `https://gs.${host}/`;
	_hcaptchaKey = 'e4953837-586a-40af-b26c-4e0c92b6ee13';
}

/*Test Key Set: Publisher Account

Test parameter Value

Site Key 10000000-ffff-ffff-ffff-000000000001 Secret Key 0x0000000000000000000000000000000000000000*/

export const bareCDN = _bareCDN;
export const rhApp = _rhApp;
export const gamesAPI = _gamesAPI;
export const gamesCDN = new URL('/games/', global.location);
export const hcaptchaKey = _hcaptchaKey;

export default document.querySelector('#root');

export function set_page(page) {
	document.documentElement.dataset.page = page;
}
