import process from 'process';

document.title = 'Holy Unblocker';

let _bareCDN;
let _rhApp;
let _gamesAPI;

if (process.env.NODE_ENV === 'development') {
	_bareCDN = 'http://localhost:8001/';
	_rhApp = 'http://localhost:8002/';
	_gamesAPI = 'http://localhost:3001/';
} else {
	const { host } = global.location;
	_bareCDN = `https://uv.${host}/bare/`;
	_rhApp = `https://rh.${host}/`;
	_gamesAPI = `https://gs.${host}/`;
}

export const bareCDN = _bareCDN;
export const rhApp = _rhApp;
export const gamesAPI = _gamesAPI;
export const gamesCDN = new URL('/games/', global.location);

export default document.querySelector('#root');

export function set_page(page) {
	document.documentElement.dataset.page = page;
}
