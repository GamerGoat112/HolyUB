import process from 'process';

let _bareCDN;
let _uvApp;

if (process.env.NODE_ENV === 'development') {
	_bareCDN = 'http://localhost:8001/';
	_uvApp = 'http://localhost:8002/service/';
} else {
	const { host } = global.location;
	_bareCDN = `https://uv.${host}/bare/`;
	_uvApp = `https://paln.${host}/service/`;
}

export const bareCDN = _bareCDN;
export const uvApp = _uvApp;

export default document.querySelector('#root');
