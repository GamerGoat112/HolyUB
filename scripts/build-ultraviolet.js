'use strict';

const { copyFile, mkdir, rm } = require('fs/promises');
const { join, resolve } = require('path');
const { promisify } = require('util');
const webpack = require('webpack');

const EXTRACT = ['uv.handler.js', 'uv.sw.js'];
const COPY = ['sw.js', 'uv.config.js'];

void (async function () {
	{
		let remove = false;

		while (true) {
			try {
				if (remove) {
					await rm('public/uv', { recursive: true });
				}

				await mkdir('public/uv');
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

	for (const file of EXTRACT) {
		try {
			await copyFile(
				join('scripts/Ultraviolet-Core', file),
				join('public/uv', file)
			);
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

	for (const file of COPY) {
		await copyFile(resolve('uv', file), join('public/uv', file));
	}

	console.log('Copied local scripts');

	console.log('Bundling UltraViolet...');

	const compiler = webpack({
		mode: 'production',
		entry: 'ultraviolet/rewrite/index.js',
		output: {
			path: resolve('public/uv'),
			filename: 'uv.bundle.js',
		},
	});

	await promisify(compiler.run.bind(compiler))();

	console.log('Bundle created');
})();
