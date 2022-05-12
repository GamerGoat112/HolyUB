import routes from './src/routes.mjs';
import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { cwd } from 'node:process';

config({ path: join(cwd(), '.env') });
config({ path: join(cwd(), '.env.local') });

config({ path: join(cwd(), '.env.production') });
config({ path: join(cwd(), '.env.production.local') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
				const page_name = `${page}.html`;
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
				const page_name = `${page_i}.html`;
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

function spawnAsync(...args) {
	return new Promise((resolve, reject) => {
		const process = spawn(...args);
		process.on('exit', resolve);
		process.on('error', reject);
	});
}

async function main() {
	await spawnAsync('npm', ['run', 'build'], {
		stdio: 'inherit',
		cwd: __dirname,
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
