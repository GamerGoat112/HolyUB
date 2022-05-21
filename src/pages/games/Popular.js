import { useEffect, useRef, useState } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Link } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';
import categories from './categories.js';
import { Obfuscated } from '../../obfuscate.js';
import resolveRoute from '../../resolveRoute.js';
import SearchBar from './Search.js';
import '../../styles/GamesCategory.scss';

function ExpandSection(props) {
	return (
		<section className="expand">
			<div className="name">
				<h1>{props.name}</h1>
				<Link to={props.href} className="theme-link see-all">
					See All
					<ArrowForward />
				</Link>
			</div>
			<ItemList className="items flex" items={props.items} />
		</section>
	);
}

const LIMIT = 8;

export default function Popular() {
	const category = Object.keys(categories).join(',');

	const [data, set_data] = useState(() => {
		const data = [];

		for (let category in categories) {
			for (let i = 0; i < LIMIT; i++) {
				data.push({
					id: i,
					loading: true,
					category,
				});
			}
		}

		return data;
	});

	const [error, set_error] = useState();
	const main = useRef();

	useEffect(() => {
		const abort = new AbortController();

		void (async function () {
			const api = new GamesAPI(DB_API, abort.signal);

			try {
				const data = await api.category({
					sort: 'plays',
					category,
					limitPerCategory: LIMIT,
				});

				const categories_keys = Object.keys(categories);

				data.sort(
					(a, b) =>
						categories_keys.indexOf(a.category) -
						categories_keys.indexOf(b.category)
				);

				set_data(data);
			} catch (error) {
				if (
					error.message !== 'The operation was aborted' &&
					error.message !== 'The user aborted a request.'
				) {
					console.error(error);
					set_error(error);
				}
			}
		})();

		return () => abort.abort();
	}, [category]);

	if (error) {
		return (
			<main className="error">
				<span>
					An error occured when loading popular <Obfuscated>games</Obfuscated>
					:
					<br />
					<pre>{error.toString()}</pre>
				</span>
				<p>
					Try again by clicking{' '}
					<a
						href="i:"
						onClick={event => {
							event.preventDefault();
							global.location.reload();
						}}
					>
						here
					</a>
					.
					<br />
					If this problem still occurs, check{' '}
					<Link
						className="theme-link"
						to={resolveRoute('/', 'faq')}
						target="_parent"
					>
						Support
					</Link>{' '}
					or{' '}
					<Link
						className="theme-link"
						to={resolveRoute('/', 'contact')}
						target="_parent"
					>
						Contact Us
					</Link>
					.
				</p>
			</main>
		);
	}

	const _categories = {};

	for (let item of data) {
		if (!(item.category in _categories)) {
			_categories[item.category] = [];
		}

		_categories[item.category].push(item);
	}

	const jsx_categories = [];

	for (let id in _categories) {
		let name;

		for (let i in categories) {
			if (id === i) {
				name = categories[i].name;
			}
		}

		jsx_categories.push(
			<ExpandSection
				href={`${resolveRoute('/games/', 'category')}?id=${id}`}
				items={_categories[id]}
				name={name}
				key={id}
			/>
		);
	}

	return (
		<main ref={main} className="games-category">
			<SearchBar category={category} />
			{jsx_categories}
		</main>
	);
}
