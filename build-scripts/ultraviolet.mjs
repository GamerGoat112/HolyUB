import webpack from 'webpack';
import fetch from 'node-fetch';
import { join, basename } from 'node:path';
import { WEBROOT } from './output.mjs';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import AdmZip from 'adm-zip';

const ARCHIVE =
	'https://github.com/titaniumnetwork-dev/Ultraviolet-Core/archive/refs/heads/main.zip';

const extract = ['uv.handler.js', 'uv.sw.js'];
let copy = ['sw.js', 'uv.config.js'];
const UV_OUTPUT = join(WEBROOT, 'uv');

{
	let remove = false;

	while (true) {
		try {
			if (remove) {
				await rm(UV_OUTPUT, { recursive: true });
			}

			await mkdir(UV_OUTPUT);
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
}

{
	console.log('Fetching', ARCHIVE);

	// Download & Extract repository ZIP
	const request = await fetch(ARCHIVE);

	if (!request.ok) {
		console.error(
			`Error fetching archive ${ARCHIVE}, got unexpected status ${request.status}`
		);
		process.exit(1);
	}

	const buffer = await request.arrayBuffer();

	console.log('Extracting archive');

	const zip = new AdmZip(Buffer.from(buffer));

	for (const entry of zip.getEntries()) {
		const base = basename(entry.entryName);

		if (extract.includes(base)) {
			const data = new Promise((resolve, reject) => {
				entry.getDataAsync((data, error) => {
					if (error) {
						reject(error);
					} else {
						resolve(data);
					}
				});
			});

			await writeFile(join(UV_OUTPUT, base), await data);
		}
	}

	console.log('Extracted archive');
}

for (let file of copy) {
	await cp(join(WEBROOT, '..', 'uv', file), join(UV_OUTPUT, file));
}

console.log('Bundling UltraViolet...');

const compiler = webpack({
	mode: 'production',
	entry: 'ultraviolet/rewrite/index.js',
	output: {
		path: UV_OUTPUT,
		filename: 'uv.bundle.js',
	},
});

await promisify(compiler.run.bind(compiler))();

console.log('Bundle created');
