import { Component } from 'react';
import { gamesCDN, set_page } from '../../root.js';
import { games_base, Item } from '../../GamesLayout.js';
import Settings from '../../Settings.js';
import '../../styles/Games Category.scss';

export default class Category extends Component {
	state = {
		data: [],
	};
	settings = new Settings(`games category ${this.props.id} settings`, {
		sort: 'Most Plays',
	});
	abort = new AbortController();
	async fetch() {
		let leastGreatest = false;
		let sort;

		switch (this.settings.get('sort')) {
			case 'Least Plays':
				leastGreatest = true;
			// falls through
			case 'Most Plays':
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

		const outgoing = await fetch(
			new URL(
				'/games/?' +
					new URLSearchParams({
						category: this.props.id,
						sort,
						leastGreatest,
					}),
				gamesCDN
			)
		);

		if (!outgoing.ok) {
			return this.setState({
				error: await outgoing.json(),
			});
		}

		this.setState({
			data: await outgoing.json(),
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

		for (let i = 0; i < this.state.data.length; i++) {
			const item = this.state.data[i];

			items.push(
				<Item
					key={i}
					index={i}
					layout={this.props.layout}
					name={item.name}
					src={new URL(item.src, games_base)}
					target={item.target}
				/>
			);
		}

		return (
			<main>
				<div className="sort">
					<select
						defaultValue={this.settings.get('sort')}
						onChange={async event => {
							this.settings.set('sort', event.target.value);
							await this.fetch();
						}}
					>
						<option value="Most Played">Most Played</option>
						<option value="Least Played">Least Played</option>
						<option value="Longest Played">Longest Played</option>
						<option value="Shortest Played">Shortest Played</option>
						<option value="Name (A-Z)">Name (A-Z)</option>
						<option value="Name (Z-A)">Name (Z-A)</option>
					</select>
				</div>
				<div className="items">{items}</div>
			</main>
		);
	}
}
