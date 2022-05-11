import { Component, createRef } from 'react';
import { DB_API } from '../../root.js';
import { GamesAPI, ItemList } from '../../GamesCommon.js';
import { Link } from 'react-router-dom';
import { ArrowForward, Search } from '@mui/icons-material';
import categories from './categories.json';
import { Obfuscated } from '../../obfuscate.js';
import Settings from '../../Settings.js';
import '../../styles/GamesCategory.scss';
import { resolveRoute } from '../../Routes.js';

function ExpandSection(props) {
	return (
		<section className="expand">
			<div className="name">
				<h1>{props.name}</h1>
				<Link to={props.href} className="see-all">
					See All
					<ArrowForward />
				</Link>
			</div>
			<div className="items">
				<ItemList items={props.items} layout={props.layout} />
			</div>
		</section>
	);
}

export default class Popular extends Component {
	limit = 8;
	constructor(props) {
		super(props);

		const data = [];

		for (let category in categories) {
			for (let i = 0; i < this.limit; i++) {
				data.push({
					id: i,
					loading: true,
					category,
				});
			}
		}

		this.state = {
			data,
			category: [],
			input_focused: false,
		};
	}
	searchbar = createRef();
	input = createRef();
	settings = new Settings('common games', {
		favorites: [],
		seen: [],
	});
	api = new GamesAPI(DB_API);
	abort = new AbortController();
	/**
	 * @returns {import('react').Ref<import('../../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	async search(query) {
		if (this.abort !== undefined) {
			this.abort.abort();
		}

		this.abort = new AbortController();

		try {
			const category = await this.api.category(
				{
					sort: 'search',
					search: query,
					limit: this.limit,
				},
				this.abort.signal
			);

			this.setState({
				category,
			});
		} catch (error) {
			if (
				error.message !== 'The operation was aborted' &&
				error.message !== 'The user aborted a request.'
			) {
				console.error(error);

				return this.setState({
					error,
				});
			}
		}
	}
	async fetch() {
		try {
			const data = await this.api.category({
				sort: 'plays',
				limitPerCategory: this.limit,
			});

			const categories_keys = Object.keys(categories);

			data.sort(
				(a, b) =>
					categories_keys.indexOf(a.category) -
					categories_keys.indexOf(b.category)
			);

			return this.setState({
				data,
			});
		} catch (error) {
			console.error(error);

			return this.setState({
				error,
			});
		}
	}
	componentDidMount() {
		this.props.layout.current.setState({ page: 'games-category' });
		this.fetch();
	}
	componentWillUnmount() {
		this.abort.abort();
	}
	render() {
		const render_suggested =
			this.state.input_focused && this.state.category.length !== 0;
		const suggested = [];

		if (render_suggested) {
			for (let i = 0; i < this.state.category.length; i++) {
				const game = this.state.category[i];
				let category_name;

				if (game.category in categories) {
					const category = categories[game.category];
					category_name = category.short || category.name;
				} else {
					console.warn(`Unknown category ${game.category}`);
					category_name = '';
				}

				const classes = ['option'];

				if (i === this.state.last_select) {
					classes.push('hover');
				}

				suggested.push(
					<Link
						key={game.id}
						onClick={() => this.setState({ input_focused: false })}
						onMouseOver={() => {
							this.setState({
								last_select: i,
							});
						}}
						to={`${resolveRoute('/', 'player')}?id=${game.id}`}
						className={classes.join(' ')}
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

		for (let item of this.state.data) {
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
					layout={this.layout}
				/>
			);
		}

		return (
			<main>
				<div
					className="search-bar"
					data-focused={Number(this.state.input_focused)}
					data-suggested={Number(render_suggested)}
					ref={this.searchbar}
					onBlur={event => {
						if (!this.searchbar.current.contains(event.relatedTarget)) {
							this.setState({ input_focused: false });
						}
					}}
				>
					<div className="theme-input-bar">
						<Search className="icon" />
						<input
							ref={this.input}
							type="text"
							placeholder="Search by game name"
							onFocus={event => {
								this.setState({ input_focused: true, last_select: -1 });
								this.search(event.target.value);
							}}
							onClick={event => {
								this.setState({ input_focused: true, last_select: -1 });
								this.search(event.target.value);
							}}
							onKeyDown={event => {
								let prevent_default = true;

								switch (event.code) {
									case 'Escape':
										this.setState({ input_focused: false });
										break;
									case 'ArrowDown':
									case 'ArrowUp':
										{
											let last_i = this.state.last_select;

											let next;

											switch (event.code) {
												case 'ArrowDown':
													if (last_i >= this.state.category.length - 1) {
														next = 0;
													} else {
														next = last_i + 1;
													}
													break;
												case 'ArrowUp':
													if (last_i <= 0) {
														next = this.state.category.length - 1;
													} else {
														next = last_i - 1;
													}
													break;
												// no default
											}

											this.setState({
												last_select: next,
											});
										}
										break;
									case 'Enter':
										{
											const game = this.state.category[this.state.last_select];

											this.input.current.blur();
											this.setState({
												input_focused: false,
											});
											this.props.navigate(
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
								this.search(event.target.value);
								this.setState({
									last_select: -1,
								});
							}}
						></input>
					</div>
					<div
						className="suggested"
						onMouseLeave={() => {
							this.setState({
								last_select: -1,
							});
						}}
					>
						{suggested}
					</div>
				</div>
				{jsx_categories}
			</main>
		);
	}
}
