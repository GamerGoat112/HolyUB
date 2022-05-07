import { Component } from 'react';
import { set_page } from '../../root.js';
import { Section } from '../../GamesCommon.js';
import Settings from '../../Settings.js';
import '../../styles/Games Category.scss';
import PlainSelect from '../../PlainSelect.js';
import categories from './categories.json';

export default class Category extends Component {
	constructor(props) {
		super(props);

		const data = [];

		for (let i = 0; i < 40; i++) {
			data.push({
				id: i,
				loading: true,
			});
		}

		this.state = {
			data,
		};
	}
	/**
	 * @returns {import('react').Ref<import('../../GamesLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	settings = new Settings(`games category ${this.props.id} settings`, {
		sort: 'Most Played',
	});
	abort = new AbortController();
	async fetch() {
		let leastGreatest = false;
		let sort;

		switch (this.settings.get('sort')) {
			case 'Least Played':
				leastGreatest = true;
			// falls through
			case 'Most Played':
				sort = 'plays';
				break;
			case 'Least Favorites':
				leastGreatest = true;
			// falls through
			case 'Most Favorites':
				sort = 'favorites';
				break;
			case 'Name (Z-A)':
				leastGreatest = true;
			// falls through
			case 'Name (A-Z)':
				sort = 'name';
				break;
			default:
				console.warn('Unknown sort', this.settings.get('sort'));
				break;
		}

		try {
			const data = await this.layout.current.games_api.category(
				{
					category: this.props.id,
					sort,
					leastGreatest,
				},
				this.abort.signal
			);

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

		return (
			<main>
				<PlainSelect
					className="sort"
					defaultValue={this.settings.get('sort')}
					onChange={event => {
						this.settings.set('sort', event.target.value);
						this.fetch();
					}}
				>
					<option value="Most Played">Most Played</option>
					<option value="Least Played">Least Played</option>
					<option value="Name (A-Z)">Name (A-Z)</option>
					<option value="Name (Z-A)">Name (Z-A)</option>
				</PlainSelect>
				<Section
					name={categories[this.props.id].name}
					items={this.state.data}
					layout={this.layout}
				/>
			</main>
		);
	}
}
