import { Component } from 'react';
import { DB_API, set_page } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import '../../styles/Games Category.scss';
import categories from './categories.json';
import { Link } from 'react-router-dom';

function ExpandSection(props) {
	return (
		<section className="expand">
			<div className="name">
				<h1>{props.name}</h1>
				<Link to={props.href} className="see-all">
					See All
					<span className="material-icons">arrow_forward</span>
				</Link>
			</div>
			<div className="items">
				<ItemList items={props.items} />
			</div>
		</section>
	);
}

export default class Category extends Component {
	limit = 8;
	constructor(props) {
		super(props);

		const data = [];

		for (let category in categories) {
			for (let i = 0; i < this.limit; i++) {
				data.push({
					id: i,
					loading: true,
					category,
				});
			}
		}

		this.state = {
			data,
		};
	}
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
				sort: 'plays',
				limitPerCategory: this.limit,
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
					href={`/games/category.html?id=${id}`}
					items={_categories[id]}
					name={name}
					key={id}
				/>
			);
		}

		return <main>{jsx_categories}</main>;
	}
}
