import DatabaseAPI from './DatabaseAPI';
import { THEATRE_CDN } from './consts';
import { Obfuscated } from './obfuscate';
import resolveRoute from './resolveRoute';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface LimitedEntry {
	name: string;
	id: string;
	category: string;
}

export class TheatreAPI extends DatabaseAPI {
	async show(id: String) {
		return await this.fetch<LimitedEntry>(`./theatre/${id}/`);
	}
	async plays(id: string, token: string) {
		return await this.fetch<LimitedEntry>(
			`./theatre/${id}/plays?` +
				new URLSearchParams({
					token,
				}),
			{
				method: 'PUT',
			}
		);
	}
	async category(params: {
		leastGreatest?: boolean;
		category?: string[];
		search?: string;
		offset?: number;
		limit?: number;
		limitPerCategory?: number;
	}) {
		return await this.fetch<{ total: number; entries: LimitedEntry[] }>(
			'./theatre/?' + new URLSearchParams(this.sortParams(params))
		);
	}
}

function Item({ id, name }: { id: string; name: string }) {
	const [loaded, setLoaded] = useState(false);

	return (
		<Link
			className="item"
			to={`${resolveRoute('/theatre/', 'player')}?id=${id}`}
		>
			<div className="thumbnail" data-loaded={Number(loaded)}>
				<img
					alt=""
					loading="lazy"
					onLoad={() => setLoaded(true)}
					src={new URL(`./thumbnails/${id}.webp`, THEATRE_CDN).toString()}
				></img>
			</div>
			<div className="name">
				<Obfuscated ellipsis>{name}</Obfuscated>
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

export interface TheatreItem {
	id: string;
	name: string;
	loading?: boolean;
}

export function ItemList({
	items,
	...attributes
}: { items: TheatreItem[] } & JSX.IntrinsicElements['div']) {
	const children = [];

	for (const item of items) {
		if (item.loading) {
			children.push(<LoadingItem />);
		} else {
			children.push(<Item key={item.id} id={item.id} name={item.name} />);
		}
	}

	return <div {...attributes}>{children}</div>;
}
