import { Component } from 'react';
import { set_page } from '../../root.js';
import { Section } from '../../GamesCommon.js';
import '../../styles/Games Category.scss';

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
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../../GamesLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	get set_favorites() {
		return this.layout.current.games_settings.get('favorites');
	}
	async fetch() {
		const data = [];

		const favorites = this.set_favorites;

		for (let id of favorites) {
			try {
				data.push(await this.layout.current.games_api.game(id));
			} catch (error) {
				// cancelled? page unload?
				if (!FETCH_FAILED.test(error)) {
					console.warn('Unable to fetch game:', id, error);
					favorites.splice(favorites.indexOf(id), 1);
				}
			}
		}

		this.layout.current.games_settings.set('favorites', favorites);

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
		set_page('games-category');

		if (this.set_favorites.length === 0) {
			return (
				<main>
					<span className="no-games">
						You haven't added any favorite games.
					</span>
				</main>
			);
		} else {
			return (
				<main>
					<Section name="Favorites" items={this.state.data} />
				</main>
			);
		}
	}
}
