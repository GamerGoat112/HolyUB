import { Outlet, Link, useNavigate } from 'react-router-dom';
import { createRef, forwardRef } from 'react';
import { Obfuscated, ObfuscateLayout } from './obfuscate.js';
import { DB_API, set_page } from './root.js';
import { GamesAPI } from './GamesCommon.js';
import categories from './pages/games/categories.json';
import Settings from './Settings.js';
import Layout from './Layout.js';
import './styles/Games.scss';

class GamesLayout extends Layout {
	games_api = new GamesAPI(DB_API);
	games_settings = new Settings('common games', {
		favorites: [],
		seen: [],
	});
	collapsable = createRef();
	input = createRef();
	expand = createRef();
	state = {
		...this.state,
		expanded: false,
		category: [],
		input_focused: false,
	};
	componentDidMount() {
		set_page('games');
	}
	categories = [];
	abort = new AbortController();
	category_click() {
		this.setState({ expanded: false });
	}
	constructor(props) {
		super(props);

		this.category_click = this.category_click.bind(this);

		for (let id in categories) {
			const { name } = categories[id];
			this.categories.push(
				<Link
					onClick={this.category_click}
					key={id}
					to={`/games/${id}.html`}
					className="entry text"
				>
					<span>{name}</span>
				</Link>
			);
		}
	}
	async search(query) {
		if (this.abort !== undefined) {
			this.abort.abort();
		}

		this.abort = new AbortController();

		const category = await this.games_api.category(
			{
				sort: 'search',
				search: query,
				limit: 8,
			},
			this.abort.signal
		);

		this.setState({
			category,
		});
	}
	update() {
		super.update();
		document.documentElement.dataset.expanded = Number(this.state.expanded);
	}
	render() {
		this.update();

		const suggested = [];

		for (let i = 0; i < this.state.category.length; i++) {
			const game = this.state.category[i];
			let category_name;

			if (game.category in categories) {
				category_name = categories[game.category].short;
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
					to={`/games/player.html?id=${game.id}`}
				>
					<div className={classes.join(' ')} key={game.id}>
						<div className="name">
							<Obfuscated ellipsis>{game.name}</Obfuscated>
						</div>
						<div className="category">{category_name}</div>
					</div>
				</Link>
			);
		}

		return (
			<>
				<ObfuscateLayout />
				<nav className="games" data-expanded={Number(this.state.expanded)}>
					<button
						tabIndex="0"
						className="expand button"
						ref={this.expand}
						onClick={async () => {
							await this.setState({
								expanded: !this.state.expanded,
							});

							if (this.state.expanded) {
								this.collapsable.current.focus();
								this.collapsable.current.scrollIntoView({
									block: 'start',
								});
							}
						}}
					>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>
					<div
						tabIndex="0"
						className="collapsable"
						data-focused={Number(this.state.input_focused)}
						ref={this.collapsable}
						onBlur={event => {
							if (
								!event.target.contains(event.relatedTarget) &&
								!this.expand.current.contains(event.relatedTarget)
							) {
								this.setState({ expanded: false });
							}
						}}
					>
						<button className="button" onClick={() => this.props.navigate('/')}>
							<span className="material-icons">chevron_left</span>
							<span className="name">Home</span>
						</button>

						<p>Genre</p>

						<div className="genres">
							<Link
								to="/games/popular.html"
								onClick={this.category_click}
								className="entry"
							>
								<span>Popular</span>
							</Link>
							<Link
								to="/games/favorites.html"
								onClick={this.category_click}
								className="entry"
							>
								<span>Favorites</span>
							</Link>
							{this.categories}
						</div>
					</div>
					<div
						className="search-bar"
						data-focused={Number(this.state.input_focused)}
						data-suggested={Number(this.state.category.length !== 0)}
						onBlur={event => {
							const search_bar = event.target.parentNode;
							if (!search_bar.contains(event.relatedTarget)) {
								this.setState({ input_focused: false });
							}
						}}
					>
						<span className="eyeglass material-icons">search</span>
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
										// eslint-disable-next-line no-lone-blocks
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
										// eslint-disable-next-line no-lone-blocks
										{
											const game = this.state.category[this.state.last_select];

											this.input.current.blur();
											this.setState({
												input_focused: false,
											});
											this.props.navigate(`/games/player.html?id=${game.id}`);
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
							onChange={event => this.search(event.target.value)}
						></input>
						<div
							className="suggested"
							onMouseLeave={() => {
								this.setState({
									last_select: -1,
								});
							}}
						>
							{this.state.input_focused ? suggested : undefined}
						</div>
					</div>
					<div className="shift-right" />
					<button
						className="button"
						onClick={() => {
							if (this.settings.get('theme') === 'day') {
								this.settings.set('theme', 'night');
							} else if (this.settings.get('theme') === 'night') {
								this.settings.set('theme', 'day');
							}
						}}
					>
						<span className="material-icons">
							{this.state.theme === 'night' ? 'brightness_7' : 'brightness_4'}
						</span>
					</button>
				</nav>
				<Outlet />
			</>
		);
	}
}

const GamesLayoutWrapper = forwardRef((props, ref) => {
	const navigate = useNavigate();
	return <GamesLayout ref={ref} {...props} navigate={navigate} />;
});

export default GamesLayoutWrapper;
