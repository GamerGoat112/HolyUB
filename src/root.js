import process from 'process';

let _bareCDN;

if (process.env.NODE_ENV === 'development') {
	_bareCDN = 'http://localhost:8001/';
} else {
	_bareCDN = `https://uv.${global.location.host}/bare/`;
}

export const bareCDN = _bareCDN;

export default document.querySelector('#root');
