const { fork } = require('child_process');
const { copyFile, mkdir } = require('fs/promises');
const { join } = require('path');

const routes = require('./src/routes.js');

process.env.NODE_ENV = 'production';
require('./config/env.js');

const build = join(__dirname, 'build');
const index = join(__dirname, 'build', 'index.html');

const routers = {
	async file() {
		for (let { dir, pages } of routes) {
			const dir_name = dir;
			const dir_abs = join(build, dir_name);

			try {
				await mkdir(dir_abs);
				console.log('Create', dir);
			} catch (error) {
				if (error.code !== 'EEXIST') {
					throw error;
				}
			}

			for (let page of pages) {
				const page_name = page === '' ? 'index.html' : `${page}.html`;
				const page_abs = join(dir_abs, page_name);

				try {
					await copyFile(index, page_abs);
					console.log('Copy', index, `${dir_name}/${page_name}`);
				} catch (error) {
					if (error.code !== 'EEXIST') {
						throw error;
					}
				}
			}
		}
	},
	async id() {
		for (let dir_i in routes) {
			const { dir, pages } = routes[dir_i];
			const dir_name = dir === '/' ? '' : dir_i;
			const dir_abs = join(build, dir_name);

			try {
				await mkdir(dir_abs);
				console.log('Create', dir_name);
			} catch (error) {
				if (error.code !== 'EEXIST') {
					throw error;
				}
			}

			for (let page_i in pages) {
				// const page = pages[page_i];
				const page_name =
					pages[page_i] === '' ? 'index.html' : `${page_i}.html`;
				const page_abs = join(dir_abs, page_name);

				try {
					copyFile(index, page_abs);
					console.log('Copy', index, `${dir_name}/${page_name}`);
				} catch (error) {
					if (error.code !== 'EEXIST') {
						throw error;
					}
				}
			}
		}
	},
};

async function main() {
	if (!process.argv.includes('--skip-npm'))
		await new Promise((resolve, reject) => {
			const process = fork(join(__dirname, 'scripts', 'build.js'), ['build'], {
				stdio: 'inherit',
				cwd: __dirname,
			});

			process.on('exit', code => {
				if (code !== 0) {
					reject();
				} else {
					resolve();
				}
			});

			process.on('error', reject);
		});

	await routers[process.env.REACT_APP_ROUTER]();

	try {
		await copyFile(index, join(build, '404.html'));
		console.log('Copy', index, '/404.html');
	} catch (error) {
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
}

main();
