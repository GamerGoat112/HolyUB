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

const LIMIT = 8;
const loading_categories = [];

for (let category in categories) {
	for (let i = 0; i < LIMIT; i++) {
		loading_categories.push({
			id: i,
			loading: true,
			category,
		});
	}
}

export default function Popular() {
	const category = Object.keys(categories).join(',');

	const [data, set_data] = useState(loading_categories);

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

	for (let category in categories) {
		_categories[category] = [];
	}

	for (let item of data) {
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
			<section className="expand" key={id}>
				<div className="name">
					<h1>{name}</h1>
					<Link
						to={`${resolveRoute('/games/', 'category')}?id=${id}`}
						className="theme-link see-all"
					>
						See All
						<ArrowForward />
					</Link>
				</div>
				<ItemList className="items flex" items={_categories[id]} />
			</section>
		);
	}

	return (
		<main ref={main} className="games-category">
			<SearchBar category={category} />
			{jsx_categories}
		</main>
	);
}
