import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Component, createRef, forwardRef } from 'react';
import { gamesAPI, set_page } from './root.js';
import { GamesAPI } from './GamesCommon.js';
import categories from './pages/games/categories.json';
import Settings from './Settings.js';
import './styles/Games.scss';
import { Obfuscated } from './obfuscate.js';

class GamesLayout extends Component {
	api = new GamesAPI(gamesAPI);
	settings = new Settings('common games', {
		favorites: [],
		seen: [],
	});
	collapsable = createRef();
	input = createRef();
	expand = createRef();
	state = {
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

		const category = await this.api.category(
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
	render() {
		const suggested = [];

		for (let i = 0; i < this.state.category.length; i++) {
			const game = this.state.category[i];
			let category_name;

			if (game.category in categories) {
				category_name = categories[game.category].name;
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
						<img
							src={`/thumbnails/${game.id}.webp`}
							alt="thumbnail"
							className="thumbnail"
						></img>
					</div>
				</Link>
			);
		}

		return (
			<>
				<nav className="games" data-expanded={Number(this.state.expanded)}>
					<div
						tabIndex="0"
						className="expand"
						ref={this.expand}
						onClick={async () => {
							await this.setState({
								expanded: !this.state.expanded,
							});

							if (this.state.expanded) {
								this.collapsable.current.focus();
							}
						}}
					>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
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
					<div className="shift-right" />
					<div
						className="search-bar"
						data-focused={Number(this.state.input_focused)}
						data-suggested={Number(this.state.category.length !== 0)}
						onBlur={event => {
							const search_bar = event.target.parentNode;
							if (!search_bar.contains(event.relatedTarget)) {
								// this.setState({ input_focused: false });
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
							onKeyDown={event => {
								let prevent_default = true;

								switch (event.code) {
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
