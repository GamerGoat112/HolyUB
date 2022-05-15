import { useEffect, useRef, useState } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Link } from 'react-router-dom';
import { ThemeSelect } from '../../ThemeElements.js';
import Settings from '../../Settings.js';
import resolveRoute from '../../resolveRoute.js';
import Footer from '../../Footer.js';
import { Obfuscated } from '../../obfuscate.js';
import useRefDefault from '../../useRefDefault.js';
import '../../styles/GamesCategory.scss';

export default function Category(props) {
	const [data, set_data] = useState(() => {
		const data = [];

		for (let i = 0; i < 40; i++) {
			data.push({
				id: i,
				loading: true,
			});
		}

		return data;
	});
	const error_cause = useRef();
	const [error, set_error] = useState();
	const settings = useRefDefault(
		() =>
			new Settings(`games category ${props.id} settings`, {
				sort: 'Most Played',
			})
	);
	const [sort, set_sort] = useState(() => settings.current.get('sort'));

	useEffect(() => {
		const abort = new AbortController();

		void (async function () {
			const api = new GamesAPI(DB_API, abort.signal);
			let leastGreatest = false;
			let sort_id;

			switch (sort) {
				case 'Least Played':
					leastGreatest = true;
				// falls through
				case 'Most Played':
					sort_id = 'plays';
					break;
				case 'Least Favorites':
					leastGreatest = true;
				// falls through
				case 'Most Favorites':
					sort_id = 'favorites';
					break;
				case 'Name (Z-A)':
					leastGreatest = true;
				// falls through
				case 'Name (A-Z)':
					sort_id = 'name';
					break;
				default:
					console.warn('Unknown sort', sort);
					break;
			}

			try {
				error_cause.current = 'Unable to fetch the category data.';

				const data = await api.category({
					category: props.id,
					sort: sort_id,
					leastGreatest,
				});

				error_cause.current = undefined;
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
	}, [sort, props.id]);

	if (error) {
		return (
			<>
				<main className="games-category">
					<span>
						An error occured when loading the category:
						<br />
						<pre>{error_cause.current || error.toString()}</pre>
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
				<Footer />
			</>
		);
	}

	return (
		<>
			<main className="games-category">
				<section>
					<div className="name">
						<h1>
							<Obfuscated>{props.name}</Obfuscated>
						</h1>
						<ThemeSelect
							className="sort"
							defaultValue={sort}
							style={{ width: 200 }}
							onChange={event => {
								settings.current.set('sort', event.target.value);
								set_sort(event.target.value);
							}}
						>
							<option value="Most Played">Most Played</option>
							<option value="Least Played">Least Played</option>
							<option value="Name (A-Z)">Name (A-Z)</option>
							<option value="Name (Z-A)">Name (Z-A)</option>
						</ThemeSelect>
					</div>
					<div className="items">
						<ItemList items={data} />
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
