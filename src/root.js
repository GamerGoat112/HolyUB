import process from 'process';

document.title = 'Holy Unblocker';

let _bareCDN;
let _rhApp;

if (process.env.NODE_ENV === 'development') {
	_bareCDN = 'http://localhost:8001/';
	_rhApp = 'http://localhost:8002/';
} else {
	const { host } = global.location;
	_bareCDN = `https://uv.${host}/bare/`;
	_rhApp = `https://rh.${host}/`;
}

export const bareCDN = _bareCDN;
export const rhApp = _rhApp;

export default document.querySelector('#root');

export function set_page(page) {
	document.documentElement.dataset.page = page;
}
