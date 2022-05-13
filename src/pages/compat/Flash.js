import { useEffect, useRef, useState } from 'react';

export default function Flash(props) {
	const player = useRef();
	const container = useRef();
	const [ruffle_loaded, set_ruffle_loaded] = useState(false);

	useEffect(() => {
		void (async function () {
			let error_cause;

			try {
				error_cause = 'Error loading Ruffle player.';
				await props.layout.current.load_script('/ruffle/ruffle.js');
				error_cause = undefined;

				const ruffle = global.RufflePlayer.newest();
				player.current = ruffle.createPlayer();
				container.current.append(player.current);

				player.current.addEventListener('loadeddata', () => {
					set_ruffle_loaded(true);
				});

				player.current.addEventListener('error', event => {
					throw event.error;
				});

				player.current.load({
					url: props.layout.current.destination.toString(),
				});
			} catch (error) {
				props.layout.current.report(error, error_cause, 'Rammerhead');
			}
		})();

		return () => {
			player.current.remove();
		};
	});

	return (
		<main
			className="compat-flash"
			data-loaded={Number(ruffle_loaded)}
			ref={container}
		></main>
	);
}
