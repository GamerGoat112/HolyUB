import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import webpack from 'webpack';

import { WEBROOT } from './output.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXTRACT = ['uv.handler.js', 'uv.sw.js'];
const COPY = ['sw.js', 'uv.config.js'];
const UV_CORE = join(__dirname, 'Ultraviolet-Core');
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

for (let file of EXTRACT) {
	try {
		await copyFile(join(UV_CORE, file), join(UV_OUTPUT, file));
	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error(
				`Unable to copy ${file}. Did you forget synchronize the Ultraviolet-Core submodule?`
			);
			process.exit(1);
		} else {
			throw error;
		}
	}
}

console.log('Extracted scripts from Ultraviolet-Core');

for (let file of COPY) {
	await copyFile(join(WEBROOT, '..', 'uv', file), join(UV_OUTPUT, file));
}

console.log('Copied local scripts');

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
