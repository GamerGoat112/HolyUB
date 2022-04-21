import { Component } from 'react';
import { gamesCDN, set_page } from '../../root.js';
import { games_base, Item } from '../../GamesLayout.js';
import '../../styles/Games Category.scss';

export default class Category extends Component {
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
		let leastGreatest = false;
		let sort = 'Most Plays';

		const outgoing = await fetch(
			new URL(
				'/games/?' +
					new URLSearchParams({
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

		for (let item of this.state.data) {
			items.push(
				<Item
					key={item.id}
					id={item.id}
					layout={this.props.layout}
					name={item.name}
					src={new URL(item.src, games_base)}
					target={item.target}
				/>
			);
		}

		return (
			<main>
				<div className="items">{items}</div>
			</main>
		);
	}
}
