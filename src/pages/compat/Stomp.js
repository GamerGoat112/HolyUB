import process from 'process';
import { useEffect } from 'react';
import { Obfuscated } from '../../obfuscate.js';
import { BARE_API } from '../../root.js';

export default function Rammerhead(props) {
	useEffect(() => {
		void (async function () {
			let error_cause;

			try {
				error_cause = 'Failure loading the Stomp bootstrapper.';
				await props.layout.current.load_script('/stomp/bootstrapper.js');
				error_cause = undefined;

				const { StompBoot } = global;

				const config = {
					bare: BARE_API,
					directory: '/stomp/',
				};

				if (process.env.NODE_ENV === 'development') {
					config.loglevel = StompBoot.LOG_TRACE;
					config.codec = StompBoot.CODEC_PLAIN;
				} else {
					config.loglevel = StompBoot.LOG_ERROR;
					config.codec = StompBoot.CODEC_XOR;
				}

				const boot = new StompBoot(config);

				error_cause = 'Failure registering the Stomp Service Worker.';
				await boot.ready;
				error_cause = undefined;

				error_cause = 'Bare server is unreachable.';
				{
					const bare = await fetch(BARE_API);
					if (!bare.ok) {
						throw await bare.json();
					}
				}
				error_cause = undefined;

				global.location.assign(boot.html(props.layout.current.destination));
			} catch (error) {
				props.layout.current.report(error, error_cause, 'Stomp');
			}
		})();
	});

	return (
		<main className="compat">
			Loading <Obfuscated>Stomp</Obfuscated>...
		</main>
	);
}
