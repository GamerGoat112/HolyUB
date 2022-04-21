import { Component, createRef } from 'react';
import { gamesCDN, set_page } from '../../root.js';
import { Obfuscated } from '../../obfuscate.js';
import { games_base, Item } from '../../GamesLayout.js';
import '../../styles/Games Category.scss';

export default class Category extends Component {
	state = {
		// leastGreatest: undefined,
	};
	abort = new AbortController();
	async fetch() {
		const outgoing = await fetch(
			new URL(
				'/games/?' +
					new URLSearchParams({
						category: this.props.id,
						leastGreatest: this.state.leastGreatest,
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

		if (this.state.data === undefined) {
			return (
				<main>
					Fetching <Obfuscated>Games</Obfuscated>...
				</main>
			);
		}

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
					<select>
						<option value="" name="test" />
					</select>
				</div>
				<div className="items">{items}</div>
			</main>
		);
	}
}
