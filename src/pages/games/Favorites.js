import { useEffect, useState } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Obfuscated } from '../../obfuscate.js';
import '../../styles/GamesCategory.scss';
import useRefDefault from '../../useRefDefault.js';

const FETCH_FAILED = /TypeError: Failed to fetch/;

export default function FavoritesCategory(props) {
	const favorite_games = useRefDefault(() =>
		props.layout.current.settings.get('favorite_games')
	);
	const [data, set_data] = useState(() =>
		favorite_games.current.map(id => ({
			loading: true,
			id,
		}))
	);

	useEffect(() => {
		const abort = new AbortController();

		void (async function () {
			const api = new GamesAPI(DB_API, abort.signal);
			const data = [];

			for (let id of favorite_games.current) {
				try {
					data.push(await api.game(id));
				} catch (error) {
					// cancelled? page unload?
					if (!FETCH_FAILED.test(error)) {
						console.warn('Unable to fetch game:', id, error);
						favorite_games.current.splice(
							favorite_games.current.indexOf(id),
							1
						);
					}
				}
			}

			props.layout.current.settings.set(
				'favorite_games',
				favorite_games.current
			);

			set_data(data);
		})();

		return () => abort.abort();
	});

	if (favorite_games.current.length === 0) {
		return (
			<main className="error">
				<p>You haven't added any favorite games.</p>
			</main>
		);
	} else {
		return (
			<main className="games-category">
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
