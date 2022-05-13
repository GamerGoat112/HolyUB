import { useEffect } from 'react';
import { Obfuscated } from '../../obfuscate.js';
import { BARE_API } from '../../root.js';

/**
 * @callback UVEncode
 * @argument {string} decoded
 * @returns {string} encoded
 */

/**
 * @callback UVDecode
 * @argument {string} encoded
 * @returns {string} decoded
 */

/**
 * @typedef {object} UVConfig
 * @property {string} bare
 * @property {string} handler
 * @property {string} bundle
 * @property {string} config
 * @property {string} sw
 * @property {UVEncode} encodeUrl
 * @property {UVDecode} decodeUrl
 */

export default function Ultraviolet(props) {
	useEffect(() => {
		void (async function () {
			let error_cause;

			try {
				error_cause = 'Failure loading the Ultraviolet bundle.';
				await props.layout.current.load_script('/uv/uv.bundle.js');
				error_cause = 'Failure loading the Ultraviolet config.';
				await props.layout.current.load_script('/uv/uv.config.js');
				error_cause = undefined;

				/**
				 * @type {UVConfig}
				 */
				const config = global.__uv$config;

				// register sw
				error_cause = 'Failure registering the Ultraviolet Service Worker.';
				await navigator.serviceWorker.register('/uv/sw.js', {
					scope: config.prefix,
					// cache sucks
					// we have plenty of bandwidth to spare
					updateViaCache: 'none',
				});
				error_cause = undefined;

				error_cause = 'Bare server is unreachable.';
				{
					const bare = await fetch(BARE_API);
					if (!bare.ok) {
						throw await bare.json();
					}
				}
				error_cause = undefined;

				global.location.assign(
					new URL(
						config.encodeUrl(props.layout.current.destination),
						new URL(config.prefix, global.location)
					)
				);
			} catch (error) {
				props.layout.current.report(error, error_cause, 'Stomp');
			}
		})();
	});

	return (
		<main className="compat">
			Loading <Obfuscated>Ultraviolet</Obfuscated>...
		</main>
	);
}
