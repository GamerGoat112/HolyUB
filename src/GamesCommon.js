import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatabaseAPI from './DatabaseAPI.js';
import { Obfuscated } from './obfuscate.js';
import resolveRoute from './resolveRoute.js';

/**
 *
 * @typedef {object} GamesCategoryParams

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

export class GamesAPI extends DatabaseAPI {
	/**
	 *
	 * @param {string} id
	 * @returns {LimitedGame}
	 */
	async game(id) {
		return await this.fetch(`./games/${id}/`);
	}
	/**
	 *
	 * @param {string} id
	 * @param {string} token
	 * @returns {LimitedGame}
	 */
	async game_plays(id, token) {
		return await this.fetch(
			`./games/${id}/plays?` +
				new URLSearchParams({
					token,
				}),
			{
				method: 'PUT',
			}
		);
	}
	/**
	 *
	 * @param {{leastGreatest?:boolean,category?:string[],sort?:string,search?:string,limit?:number,limitPerCategory:?number}} params
	 * @returns {GamesCategory}
	 */
	async category(params) {
		return await this.fetch(
			'./games/?' + new URLSearchParams(this.sort_params(params))
		);
	}
}

function Item(props) {
	const [loaded, set_loaded] = useState(false);

	return (
		<Link
			className="item"
			to={`${resolveRoute('/theatre/', 'player')}?id=${props.id}`}
		>
			<div className="thumbnail" data-loaded={Number(loaded)}>
				<img
					alt=""
					loading="lazy"
					onLoad={() => set_loaded(true)}
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
