import { createRef, useEffect, useRef, useState } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowForward, Search } from '@mui/icons-material';
import categories from './categories.js';
import { Obfuscated } from '../../obfuscate.js';
import resolveRoute from '../../resolveRoute.js';
import { ThemeInputBar } from '../../ThemeElements.js';
import clsx from 'clsx';
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
			<div className="items">
				<ItemList items={props.items} />
			</div>
		</section>
	);
}

const LIMIT = 8;

export default function Popular(props) {
	const navigate = useNavigate();
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
	const [category, set_category] = useState([]);
	const [last_select, set_last_select] = useState(-1);
	const [input_focused, set_input_focused] = useState(false);
	const [error, set_error] = useState();
	const search_abort = useRef();

	const input = createRef();

	async function search(query) {
		if (search_abort.current === undefined) {
			search_abort.current = new AbortController();
		} else {
			search_abort.current.abort();
		}

		const api = new GamesAPI(DB_API, search_abort.current.signal);

		try {
			const category = await api.category({
				sort: 'search',
				search: query,
				limit: LIMIT,
			});

			set_category(category);
		} catch (error) {
			if (
				error.message !== 'The operation was aborted' &&
				error.message !== 'The user aborted a request.'
			) {
				console.error(error);
				set_error(error);
			}
		}
	}

	useEffect(() => {
		const abort = new AbortController();

		void (async function () {
			const api = new GamesAPI(DB_API, abort.signal);

			try {
				const data = await api.category({
					sort: 'plays',
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
	});

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

	const render_suggested = input_focused && category.length !== 0;
	const suggested_list = [];

	if (render_suggested) {
		for (let i = 0; i < category.length; i++) {
			const game = category[i];
			let category_name;

			if (game.category in categories) {
				const category = categories[game.category];
				category_name = category.short || category.name;
			} else {
				console.warn(`Unknown category ${game.category}`);
				category_name = '';
			}

			const classes = ['option'];

			if (i === last_select) {
				classes.push('hover');
			}

			suggested_list.push(
				<Link
					key={game.id}
					onClick={() => set_input_focused(false)}
					onMouseOver={() => set_last_select(i)}
					to={`${resolveRoute('/games/', 'player')}?id=${game.id}`}
					className={clsx('option', i === last_select && 'hover')}
				>
					<div className="name">
						<Obfuscated ellipsis>{game.name}</Obfuscated>
					</div>
					<div className="category">{category_name}</div>
				</Link>
			);
		}
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
		<main className="games-category">
			<div
				className="search-bar"
				data-focused={Number(input_focused)}
				data-suggested={Number(render_suggested)}
				onBlur={event => {
					if (!event.target.contains(event.relatedTarget)) {
						set_input_focused(false);
					}
				}}
			>
				<ThemeInputBar>
					<Search className="icon" />
					<input
						ref={input}
						type="text"
						className="thin-pad-left"
						placeholder="Search by game name"
						onFocus={event => {
							set_input_focused(true);
							set_last_select(-1);
							search(event.target.value);
						}}
						onClick={event => {
							set_input_focused(true);
							set_last_select(-1);
							search(event.target.value);
						}}
						onKeyDown={event => {
							let prevent_default = true;

							switch (event.code) {
								case 'Escape':
									set_input_focused(false);
									break;
								case 'ArrowDown':
								case 'ArrowUp':
									{
										let last_i = last_select;

										let next;

										switch (event.code) {
											case 'ArrowDown':
												if (last_i >= category.length - 1) {
													next = 0;
												} else {
													next = last_i + 1;
												}
												break;
											case 'ArrowUp':
												if (last_i <= 0) {
													next = category.length - 1;
												} else {
													next = last_i - 1;
												}
												break;
											// no default
										}

										set_last_select(next);
									}
									break;
								case 'Enter':
									{
										const game = category[last_select];

										input.current.blur();
										set_input_focused(false);
										navigate(
											`${resolveRoute('/games/', 'player')}?id=${game.id}`
										);
									}
									break;
								default:
									prevent_default = false;
									break;
								// no default
							}

							if (prevent_default) {
								event.preventDefault();
							}
						}}
						onChange={event => {
							search(event.target.value);
							set_last_select(-1);
						}}
					></input>
				</ThemeInputBar>
				<div
					className="suggested"
					onMouseLeave={() => {
						set_last_select(-1);
					}}
				>
					{suggested_list}
				</div>
			</div>
			{jsx_categories}
		</main>
	);
}
