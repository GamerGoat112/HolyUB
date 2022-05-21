import { useEffect, useState } from 'react';
import { DB_API } from '../../../root.js';
import { GamesAPI, ItemList } from '../../../GamesCommon.js';
import { Obfuscated } from '../../../obfuscate.js';
import '../../../styles/TheatreCategory.scss';

const FETCH_FAILED = /TypeError: Failed to fetch/;

export default function Favorites(props) {
	const [data, set_data] = useState(() =>
		props.layout.current.settings.favorite_games.map(id => ({
			loading: true,
			id,
		}))
	);

	useEffect(() => {
		const abort = new AbortController();

		void (async function () {
			const api = new GamesAPI(DB_API, abort.signal);
			const data = [];

			for (let id of props.layout.current.settings.favorite_games) {
				try {
					data.push(await api.game(id));
				} catch (error) {
					// cancelled? page unload?
					if (!FETCH_FAILED.test(error)) {
						console.warn('Unable to fetch game:', id, error);
						props.layout.current.settings.favorite_games.splice(
							props.layout.current.settings.favorite_games.indexOf(id),
							1
						);
					}
				}
			}

			// update settings
			props.layout.current.set_settings({
				...props.layout.current.settings,
			});

			set_data(data);
		})();

		return () => abort.abort();
	}, [props.layout]);

	if (props.layout.current.settings.favorite_games.length === 0) {
		return (
			<main className="error">
				<p>You haven't added any favorite games.</p>
			</main>
		);
	} else {
		return (
			<main className="theatre-category">
				<section>
					<div className="name">
						<h1>
							<Obfuscated>Favorites</Obfuscated>
						</h1>
					</div>
					<div className="items">
						<ItemList items={data} />
					</div>
				</section>
			</main>
		);
	}
}
