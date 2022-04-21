import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Obfuscated } from './obfuscate.js';
import { gamesAPI } from './root.js';
import Settings from './Settings.js';

export const common_settings = new Settings(
	'common games',
	{
		favorites: [],
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
	async category(category, sort, leastGreatest) {
		const params = {};

		if (typeof category === 'string') {
			params.category = category;
		}

		if (typeof sort === 'string') {
			params.sort = sort;
		}

		if (typeof leastGreatest === 'boolean') {
			params.leastGreatest = leastGreatest;
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
					{
						// todo: make <img src="...something with this.props.id in src"
					}
					<div className="front"></div>
					<div className="name">
						<Obfuscated>{this.props.name}</Obfuscated>
					</div>
				</div>
			</>
		);
	}
}
