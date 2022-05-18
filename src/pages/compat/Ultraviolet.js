import { useEffect, useRef } from 'react';
import { ScriptsOrder, Script } from '../../CompatLayout.js';
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
	const uv_bundle = useRef();
	const uv_config = useRef();

	useEffect(() => {
		void (async function () {
			let error_cause;

			try {
				error_cause = 'Failure loading the Ultraviolet bundle.';
				await uv_bundle.current.promise;
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
						config.encodeUrl(props.compat_layout.current.destination),
						new URL(config.prefix, global.location)
					)
				);
			} catch (error) {
				props.compat_layout.current.report(error, error_cause, 'Stomp');
			}
		})();
	}, [props.compat_layout, uv_bundle, uv_config]);

	return (
		<main className="compat">
			<ScriptsOrder ref={uv_bundle}>
				<Script src="/uv/uv.bundle.js" />
				<Script src="/uv/uv.config.js" />
			</ScriptsOrder>
			Loading <Obfuscated>Ultraviolet</Obfuscated>...
		</main>
	);
}
