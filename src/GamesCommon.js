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
	/**
	 *
	 * @param {string} server
	 * @param {AbortSignal} [signal]
	 */
	constructor(server, signal) {
		this.server = server;
		this.signal = signal;
	}
	/**
	 *
	 * @param {string} url
	 * @param {object} init
	 * @returns
	 */
	async fetch(url, init = {}) {
		return await fetch(new URL(url, this.server), {
			...init,
			signal: this.signal,
		});
	}
	/**
	 *
	 * @param {string} id
	 * @returns {LimitedGame}
	 */
	async game(id) {
		const outgoing = await this.fetch(`./games/${id}/`);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
	/**
	 *
	 * @param {string} id
	 * @param {string} token
	 * @returns {LimitedGame}
	 */
	async game_plays(id, token) {
		const outgoing = await this.fetch(
			`./games/${id}/plays?` +
				new URLSearchParams({
					token,
				}),
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
	 * @returns {GamesCategory}
	 */
	async category(params) {
		const outgoing = await this.fetch(
			'./games/?' + new URLSearchParams(this.sort_params(params))
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
		<Link
			className="item"
			to={`${resolveRoute('/games/', 'player')}?id=${props.id}`}
		>
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

/**
 * @param {React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {items: {id:string,name?:string,loading:boolean}}} props
 * @returns
 */
export function ItemList(props) {
	const { items, ...attributes } = props;

	const children = [];

	for (let item of items) {
		if (item.loading) {
			children.push(<LoadingItem key={item.id} id={item.id} />);
		} else {
			children.push(<Item key={item.id} id={item.id} name={item.name} />);
		}
	}

	return <div {...attributes}>{children}</div>;
}
