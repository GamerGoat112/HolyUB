import { Component } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, Section } from '../../GamesCommon.js';
import Settings from '../../Settings.js';
import '../../styles/GamesCategory.scss';

const FETCH_FAILED = /TypeError: Failed to fetch/;

export default class FavoritesCategory extends Component {
	constructor(props) {
		super(props);

		const data = [];

		for (let id of this.set_favorites) {
			data.push({
				loading: true,
				id,
			});
		}

		this.state = {
			data,
		};
	}
	api = new GamesAPI(DB_API);
	settings = new Settings('common games', {
		favorites: [],
		seen: [],
	});
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	get set_favorites() {
		return this.settings.get('favorites');
	}
	async fetch() {
		const data = [];

		const favorites = this.set_favorites;

		for (let id of favorites) {
			try {
				data.push(await this.api.game(id));
			} catch (error) {
				// cancelled? page unload?
				if (!FETCH_FAILED.test(error)) {
					console.warn('Unable to fetch game:', id, error);
					favorites.splice(favorites.indexOf(id), 1);
				}
			}
		}

		this.settings.set('favorites', favorites);

		return this.setState({
			data,
		});
	}
	componentDidMount() {
		this.fetch();
	}
	componentWillUnmount() {
		this.abort.abort();
	}
	render() {
		if (this.set_favorites.length === 0) {
			return (
				<main className="games-category">
					<span className="no-games">
						You haven't added any favorite games.
					</span>
				</main>
			);
		} else {
			return (
				<main className="games-category">
					<Section
						name="Favorites"
						items={this.state.data}
						layout={this.layout}
					/>
				</main>
			);
		}
	}
}
