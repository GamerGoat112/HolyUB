import webpack from 'webpack';
import { join, basename } from 'node:path';
import { webroot } from './output.mjs';
import { cp, mkdir, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { Parse } from 'unzipper';
import fetch from 'node-fetch';
import { createWriteStream } from 'node:fs';

const uv_output = join(webroot, 'uv');

let remove = false;

while (true) {
	try {
		if (remove) {
			await rm(uv_output, { recursive: true });
		}

		await mkdir(uv_output);
		break;
	} catch (error) {
		if (error.code === 'EEXIST') {
			remove = true;
		} else {
			console.error(error);
			process.exit(1);
		}
	}
}

// Download & Extract repository ZIP
const zip = await fetch(
	'https://github.com/titaniumnetwork-dev/Ultraviolet-Core/archive/refs/heads/main.zip'
);

if (!zip.ok) {
	console.error(
		`Error fetching archive ${zip.url}, got unexpected status ${zip.status}`
	);
	process.exit(1);
}

const extract = ['uv.handler.js', 'uv.sw.js'];
const promises = [];

console.log('Parsing archive');

for await (const entry of zip.body.pipe(Parse({ forceStream: true }))) {
	const base = basename(entry.path);

	if (extract.includes(base)) {
		entry.pipe(createWriteStream(join(uv_output, base)));
		promises.push(
			new Promise((resolve, reject) => {
				entry.on('end', resolve);
				entry.on('error', reject);
			})
		);
	} else {
		entry.autodrain();
	}
}

console.log(`Parsed archive ${zip.url}`);

await Promise.all(promises);

console.log('Extracted needed files from archive.');

let copy = ['sw.js', 'uv.config.js'];

for (let file of copy) {
	await cp(join(webroot, '..', 'uv', file), join(uv_output, file));
}
console.log('Bundling UltraViolet...');

const compiler = webpack({
	mode: 'production',
	entry: 'ultraviolet/rewrite/index.js',
	output: {
		path: uv_output,
		filename: 'uv.bundle.js',
	},
});

await promisify(compiler.run.bind(compiler))();

console.log('Bundle created');
