import { Link } from 'react-router-dom';
import { Obfuscated } from './obfuscate.js';
import { gamesAPI } from './root.js';

/**
 *
 * @typedef {object} GamesCategoryParams
 * @property {boolean} [leastGreatest]
 * @property {string} [category]
 * @property {string} [sort]
 * @property {string} [search]
 * @property {number} [limit]
 * @property {number} [limitPerCategory]
 */

/**
 *
 * @typedef {object} LimitedGame
 * @property {string} name
 * @property {string} id
 * @property {string} category
 */

/**
 *
 * @typedef {LimitedGame[]} GamesCategory
 */

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
	sort_params(params) {
		for (let param in params) {
			switch (typeof params[param]) {
				case 'undefined':
				case 'object':
					delete params[param];
					break;
				// no default
			}
		}

		return params;
	}
	/**
	 *
	 * @param {GamesCategoryParams} params
	 * @param {AbortSignal} signal
	 * @returns {GamesCategory}
	 */
	async category(params, signal) {
		const outgoing = await fetch(
			new URL(
				'./games/?' + new URLSearchParams(this.sort_params(params)),
				gamesAPI
			),
			{ signal }
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
}

export function Section(props) {
	const items = [];

	for (let item of props.items) {
		items.push(<Item key={item.id} id={item.id} name={item.name} />);
	}

	return (
		<section>
			<h1>{props.name}</h1>
			<div className="items">{items}</div>
		</section>
	);
}

export function Item(props) {
	return (
		<Link to={`/games/player.html?id=${props.id}`}>
			<div className="item">
				<img alt="thumbnail" src={`/thumbnails/${props.id}.webp`}></img>
				<div>
					<Obfuscated>{props.name}</Obfuscated>
				</div>
			</div>
		</Link>
	);
}
