import { Component, createRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Obfuscated } from './obfuscate.js';
import { gamesAPI } from './root.js';
import Settings from './Settings.js';

export const common_settings = new Settings(
	'common games',
	{
		favorites: [],
		seen: [],
	},
	this
);

export class GamesAPI {
	constructor(server) {
		this.server = server;
	}
	async game(id) {
		const outgoing = await fetch(new URL(`./games/${id}/`, gamesAPI));

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
	async game_plays(id, token) {
		const outgoing = await fetch(
			new URL(
				`./games/${id}/plays?` +
					new URLSearchParams({
						token,
					}),
				gamesAPI
			),
			{
				method: 'PUT',
			}
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
	async category(category, sort, leastGreatest) {
		const params = {};

		if (typeof category === 'string') {
			params.category = category;
		}

		if (typeof sort === 'string') {
			params.sort = sort;
		}

		if (typeof leastGreatest === 'boolean') {
			params.leastGreatest = leastGreatest.toString();
		}

		const outgoing = await fetch(
			new URL('./games/?' + new URLSearchParams(params), gamesAPI)
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
}

export class Section extends Component {
	render() {
		const items = [];

		for (let item of this.props.items) {
			items.push(<Item key={item.id} id={item.id} name={item.name} />);
		}

		return (
			<section>
				<h1>{this.props.name}</h1>
				<div className="items">{items}</div>
			</section>
		);
	}
}

export class Item extends Component {
	state = {
		search: false,
		redirect: '',
	};
	open() {
		this.setState({
			redirect:
				'/games/player.html?' +
				new URLSearchParams({
					id: this.props.id,
				}),
		});
	}
	render() {
		let redirect;

		if (this.state.redirect !== '') {
			redirect = <Navigate replace to={this.state.redirect} />;
		}

		return (
			<>
				{redirect}
				<div className="item" onClick={this.open.bind(this)}>
					<img
						alt={this.props.name}
						src={`/thumbnails/${this.props.id}.webp`}
					></img>
					<div>
						<Obfuscated>{this.props.name}</Obfuscated>
					</div>
				</div>
			</>
		);
	}
}
