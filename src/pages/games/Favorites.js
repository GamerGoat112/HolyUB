import { useEffect, useState } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Obfuscated } from '../../obfuscate.js';
import Footer from '../../Footer.js';
import '../../styles/GamesCategory.scss';

const FETCH_FAILED = /TypeError: Failed to fetch/;

export default function FavoritesCategory(props) {
	const [data, set_data] = useState([]);
	const favorite_games = props.layout.current.settings.get('favorite_games');

	let items;

	if (data.length) {
		items = data;
	} else {
		items = favorite_games.map(id => ({
			loading: true,
			id,
		}));
	}

	useEffect(() => {
		void (async function () {
			const api = new GamesAPI(DB_API);
			const data = [];

			const favorites = favorite_games;

			for (let id of favorites) {
				try {
					data.push(await api.game(id));
				} catch (error) {
					// cancelled? page unload?
					if (!FETCH_FAILED.test(error)) {
						console.warn('Unable to fetch game:', id, error);
						favorites.splice(favorites.indexOf(id), 1);
					}
				}
			}

			props.layout.current.settings.set('favorite_games', favorite_games);

			set_data(data);
		})();
	});

	if (favorite_games.length === 0) {
		return (
			<>
				<main className="error">
					<p>You haven't added any favorite games.</p>
				</main>
				<Footer />
			</>
		);
	} else {
		return (
			<>
				<main className="games-category">
					<section>
						<div className="name">
							<h1>
								<Obfuscated>Favorites</Obfuscated>
							</h1>
						</div>
						<div className="items">
							<ItemList items={items} />
						</div>
					</section>
				</main>
				<Footer />
			</>
		);
	}
}
