import { Component } from 'react';
import { gamesAPI, set_page } from '../../root.js';
import { Item, GamesAPI } from '../../GamesUtil.js';
import '../../styles/Games Category.scss';
import categories from './categories.json';

export default class Category extends Component {
	state = {
		data: [],
	};
	api = new GamesAPI(gamesAPI);
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	async fetch() {
		try {
			const data = await this.api.category(undefined, 'Most Plays', false);

			return this.setState({
				data,
			});
		} catch (error) {
			return this.setState({
				error,
			});
		}
	}
	componentDidMount() {
		this.fetch();
	}
	componentWillUnmount() {
		this.abort.abort();
	}
	render() {
		set_page('games-category');

		const _categories = {};

		for (let item of this.state.data) {
			if (!(item.category in _categories)) {
				_categories[item.category] = [];
			}

			_categories[item.category].push(
				<Item
					key={item.id}
					id={item.id}
					layout={this.props.layout}
					name={item.name}
				/>
			);
		}

		const jsx_categories = [];

		for (let id in _categories) {
			const items = _categories[id];

			let name;

			for (let { id: i, name: n } of categories) {
				if (id === i) {
					name = n;
				}
			}

			jsx_categories.push(
				<section key={id}>
					<h1>{name}</h1>
					<div className="items">{items}</div>
				</section>
			);
		}

		return <main>{jsx_categories}</main>;
	}
}
