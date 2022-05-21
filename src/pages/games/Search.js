import { ThemeInputBar } from '../../ThemeElements.js';
import { Search } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GamesAPI } from '../../GamesCommon.js';
import { DB_API } from '../../root.js';
import categories from './categories.js';
import clsx from 'clsx';
import resolveRoute from '../../resolveRoute.js';
import { Obfuscated } from '../../obfuscate.js';
import '../../styles/GamesSearch.scss';

const LIMIT = 8;

export default function SearchBar({ category }) {
	const navigate = useNavigate();
	const input = useRef();
	const [category_data, set_category_data] = useState([]);
	const [last_select, set_last_select] = useState(-1);
	const [input_focused, set_input_focused] = useState(false);
	const search_abort = useRef();
	const bar = useRef();

	async function search(query) {
		if (search_abort.current !== undefined) {
			search_abort.current.abort();
		}

		search_abort.current = new AbortController();

		const api = new GamesAPI(DB_API, search_abort.current.signal);

		try {
			const category_data = await api.category({
				sort: 'search',
				search: query,
				limit: LIMIT,
				category,
			});

			set_category_data(category_data);
		} catch (error) {
			if (
				error.message !== 'The operation was aborted' &&
				error.message !== 'The user aborted a request.'
			) {
				console.error(error);
			}
		}
	}

	const render_suggested = input_focused && category_data.length !== 0;
	const suggested_list = [];

	if (render_suggested) {
		for (let i = 0; i < category_data.length; i++) {
			const game = category_data[i];
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
					tabIndex={0}
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

	return (
		<div
			className="games-search-bar"
			data-focused={Number(input_focused)}
			data-suggested={Number(render_suggested)}
			ref={bar}
			onBlur={event => {
				if (!bar.current.contains(event.relatedTarget)) {
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
											if (last_i >= category_data.length - 1) {
												next = 0;
											} else {
												next = last_i + 1;
											}
											break;
										case 'ArrowUp':
											if (last_i <= 0) {
												next = category_data.length - 1;
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
									const game = category_data[last_select];

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
	);
}
