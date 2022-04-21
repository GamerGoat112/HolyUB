import { Component } from 'react';
import { gamesAPI, set_page } from '../../root.js';
import { Item, common_settings, GamesAPI } from '../../GamesUtil.js';
import '../../styles/Games Category.scss';

export default class FavoritesCategory extends Component {
	api = new GamesAPI(gamesAPI);
	state = {
		data: [],
	};
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	async fetch() {
		const data = [];

		for (let id of common_settings.get('favorites')) {
			data.push(await this.api.game(id));
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

		return (
			<main>
				<h1>Favorites</h1>
				<div className="items">{items}</div>
			</main>
		);
	}
}
