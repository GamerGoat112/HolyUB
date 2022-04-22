import { Component } from 'react';
import { set_page } from '../../root.js';
import { Item, Section } from '../../GamesCommon.js';
import '../../styles/Games Category.scss';

export default class FavoritesCategory extends Component {
	state = {
		data: [],
	};
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	/**
	 * @returns {import('react').Ref<import('../../GamesLayout.js').default>}
	 */
	get games_layout() {
		return this.props.games_layout;
	}
	async fetch() {
		const data = [];

		for (let id of this.games_layout.current.settings.get('favorites')) {
			data.push(await this.games_layout.current.api.game(id));
		}

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

		const items = [];

		for (let item of this.state.data) {
			items.push(
				<Item
					key={item.id}
					id={item.id}
					layout={this.props.layout}
					name={item.name}
				/>
			);
		}

		if (this.state.data.length === 0) {
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
