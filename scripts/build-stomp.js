'use strict';

const { resolve } = require('path');

void (async function () {
	const { default: Builder } = await import('stomp');

	const builder = new Builder(resolve('public/stomp'));

	console.log('Bundling Stomp...');
	await builder.build();
	console.log('Bundle created');
})();
