import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Obfuscated } from './obfuscate.js';
import resolveRoute from './resolveRoute.js';

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
		const outgoing = await fetch(new URL(`./games/${id}/`, this.server));

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
				this.server
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
				this.server
			),
			{ signal }
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
}

function Item(props) {
	const [loaded, set_loaded] = useState(false);

	return (
		<Link to={`${resolveRoute('/games/', 'player')}?id=${props.id}`}>
			<div className="item">
				<div className="thumbnail">
					<img
						alt=""
						loading="lazy"
						onLoad={() => set_loaded(true)}
						data-loaded={Number(loaded)}
						src={`/thumbnails/${props.id}.webp`}
					></img>
				</div>
				<div className="name">
					<Obfuscated ellipsis>{props.name}</Obfuscated>
				</div>
			</div>
		</Link>
	);
}

function LoadingItem() {
	return (
		<div className="item loading">
			<div className="thumbnail" />
			<div className="name" />
		</div>
	);
}

export function ItemList(props) {
	const items = [];

	for (let item of props.items) {
		if (item.loading) {
			items.push(<LoadingItem key={item.id} id={item.id} />);
		} else {
			items.push(
				<Item
					key={item.id}
					id={item.id}
					name={item.name}
					layout={props.layout}
				/>
			);
		}
	}

	return items;
}
