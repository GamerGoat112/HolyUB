import { Component } from 'react';
import { DB_API, set_page } from '../../root.js';
import { Item, GamesAPI } from '../../GamesCommon.js';
import '../../styles/Games Category.scss';
import categories from './categories.json';
import { Link } from 'react-router-dom';

export class ExpandSection extends Component {
	render() {
		const items = [];

		for (let item of this.props.items) {
			items.push(<Item key={item.id} id={item.id} name={item.name} />);
		}

		return (
			<section className="expand">
				<h1>{this.props.name}</h1>
				<div className="items">{items}</div>
				<Link to={this.props.href} className="expand-icon material-icons">
					<div>expand_more</div>
				</Link>
			</section>
		);
	}
}

export default class Category extends Component {
	state = {
		data: [],
	};
	api = new GamesAPI(DB_API);
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	async fetch() {
		try {
			const data = await this.api.category({
				sort: 'Most Plays',
				limitPerCategory: 6,
			});

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

			_categories[item.category].push(item);
		}

		const jsx_categories = [];

		for (let id in _categories) {
			let name;

			for (let i in categories) {
				if (id === i) {
					name = categories[i].name;
				}
			}

			jsx_categories.push(
				<ExpandSection
					href={`/games/${id}.html`}
					items={_categories[id]}
					name={name}
					key={id}
				/>
			);
		}

		return <main>{jsx_categories}</main>;
	}
}
