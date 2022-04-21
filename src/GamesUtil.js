import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Obfuscated } from './obfuscate.js';
import { gamesAPI } from './root.js';

export async function fetch_category(category, sort, leastGreatest) {
	const outgoing = await fetch(
		new URL(
			'/games/?' +
				new URLSearchParams({
					category,
					sort,
					leastGreatest,
				}),
			gamesAPI
		)
	);

	if (!outgoing.ok) {
		throw await outgoing.json();
	}

	return await outgoing.json();
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
