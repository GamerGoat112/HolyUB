/* eslint-disable */

let bare;

if (location.hostname === 'localhost') {
	bare = 'http://localhost:8001/bare/';
} else {
	bare = `https://uv.${location.host}.`;
}

self.__uv$config = {
	prefix: '/uv/',
	bare,
	encodeUrl: Ultraviolet.codec.xor.encode,
	decodeUrl: Ultraviolet.codec.xor.decode,
	handler: '/uv/uv.handler.js',
	bundle: '/uv/uv.bundle.js',
	config: '/uv/uv.config.js',
	sw: '/uv/uv.sw.js',
};
