/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line strict
'use strict';

const webpack = require('webpack');
const path = require('path');
const routes = require('./src/routes.js');

class HolyUnblockerRouterPlugin {
	/**
	 *
	 * @param {import('webpack').Compiler} compiler
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap(
			'HolyUnblockerRouterPlugin',
			(compilation) => {
				compilation.hooks.processAssets.tap(
					{
						name: 'HolyUnblockerRouterPlugin',
						stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
					},
					(assets) => {
						const index = assets['index.html'];

						if (index) {
							assets['404.html'] = index;

							switch (process.env.REACT_APP_ROUTER) {
								case 'id':
									for (const dirI in routes) {
										const { dir, pages } = routes[dirI];
										const dirName = dir === '/' ? '' : dirI;

										for (const pageI in pages) {
											// const page = pages[pageI];
											const pageName =
												pages[pageI] === '' ? 'index.html' : `${pageI}.html`;
											const pageAbs = path.join(dirName, pageName);

											assets[pageAbs] = index;
										}
									}
									break;
								default:
								case 'file':
									for (const { dir, pages } of routes) {
										const dirName = dir;

										for (const page of pages) {
											const pageName =
												page === '' ? 'index.html' : `${page}.html`;
											const pageAbs = path.join(dirName, pageName);

											assets[pageAbs] = index;
										}
									}
									break;
							}
						}
					}
				);
			}
		);
	}
}

module.exports = HolyUnblockerRouterPlugin;
