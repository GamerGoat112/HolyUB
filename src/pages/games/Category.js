import { useEffect, useRef, useState } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Link } from 'react-router-dom';
import { ThemeSelect } from '../../ThemeElements.js';
import { useSettings } from '../../Settings.js';
import resolveRoute from '../../resolveRoute.js';
import { Obfuscated } from '../../obfuscate.js';
import SearchBar from './Search.js';
import '../../styles/GamesCategory.scss';

function loading_categories() {
	const data = [];

	for (let i = 0; i < 40; i++) {
		data.push({
			id: i,
			loading: true,
		});
	}

	return data;
}

export default function Category(props) {
	const [data, set_data] = useState(loading_categories);
	const error_cause = useRef();
	const [error, set_error] = useState();
	const [settings, set_settings] = useSettings(
		`games category ${props.id} settings`,
		() => ({
			sort: 'Most Played',
		})
	);

	useEffect(() => {
		set_data(loading_categories());

		const abort = new AbortController();

		void (async function () {
			const api = new GamesAPI(DB_API, abort.signal);
			let leastGreatest = false;
			let sort;

			switch (settings.sort) {
				case 'Least Played':
					leastGreatest = true;
				// falls through
				case 'Most Played':
					sort = 'plays';
					break;
				case 'Least Favorites':
					leastGreatest = true;
				// falls through
				case 'Most Favorites':
					sort = 'favorites';
					break;
				case 'Name (Z-A)':
					leastGreatest = true;
				// falls through
				case 'Name (A-Z)':
					sort = 'name';
					break;
				default:
					console.warn('Unknown sort', settings.sort);
					break;
			}

			try {
				error_cause.current = 'Unable to fetch the category data.';

				const data = await api.category({
					category: props.category,
					sort,
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
	}, [props.category, props.id, settings.sort]);

	if (error) {
		return (
			<main className="error">
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
		);
	}

	return (
		<main className="games-category">
			<SearchBar category={props.category} />
			<section>
				<div className="name">
					<h1>
						<Obfuscated ellipsis>{props.name}</Obfuscated>
					</h1>
					<ThemeSelect
						className="sort"
						defaultValue={settings.sort}
						style={{ width: 145, flex: 'none' }}
						onChange={event => {
							set_settings({
								...settings,
								sort: event.target.value,
							});
						}}
					>
						<option value="Most Played">Most Played</option>
						<option value="Least Played">Least Played</option>
						<option value="Name (A-Z)">Name (A-Z)</option>
						<option value="Name (Z-A)">Name (Z-A)</option>
					</ThemeSelect>
				</div>
				<ItemList className="items" items={data} />
			</section>
		</main>
	);
}
