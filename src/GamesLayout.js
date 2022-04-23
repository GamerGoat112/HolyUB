import { Outlet, Link } from 'react-router-dom';
import { Component } from 'react';
import { gamesAPI, set_page } from './root.js';
import { GamesAPI } from './GamesCommon.js';
import categories from './pages/games/categories.json';
import Settings from './Settings.js';
import './styles/Games.scss';

export default class GamesLayout extends Component {
	api = new GamesAPI(gamesAPI);
	settings = new Settings('common games', {
		favorites: [],
		seen: [],
	});
	state = {
		expanded: false,
		suggested: [],
		input_focused: false,
	};
	componentDidMount() {
		set_page('games');
	}
	categories = [];
	abort = new AbortController();
	constructor(props) {
		super(props);

		for (let id in categories) {
			const { name } = categories[id];
			this.categories.push(
				<Link key={id} to={`/games/${id}.html`} className="entry text">
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
				search: query,
				limit: 8,
			},
			this.abort.signal
		);

		const suggested = [];

		for (let game of category) {
			suggested.push(
				<Link key={game.id} to={`/games/${game.id}/player.html`}>
					<div key={game.id}>
						<div className="name">{game.name}</div>
						<div className="category">
							{game.category in categories
								? categories[game.category].name
								: console.warn(game, game.category)}
						</div>
						<img
							src={`/thumbnails/${game.id}.webp`}
							alt="thumbnail"
							className="thumbnail"
						></img>
					</div>
				</Link>
			);
		}

		this.setState({
			suggested,
		});
	}
	render() {
		return (
			<>
				<nav className="games" data-expanded={Number(this.state.expanded)}>
					<div
						className="expand"
						onClick={() => this.setState({ expanded: !this.state.expanded })}
					>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
					<div className="collapsable">
						<Link to="/games/popular.html" className="entry">
							<span>Popular</span>
						</Link>
						<Link to="/games/favorites.html" className="entry">
							<span>Favorites</span>
						</Link>
						{this.categories}
					</div>
					<div className="shift-right" />
					<div
						className="search-bar"
						data-focused={Number(this.state.input_focused)}
						data-suggested={Number(this.state.suggested.length !== 0)}
						onBlur={event => {
							const search_bar = event.target.parentNode;
							if (!search_bar.contains(event.relatedTarget)) {
								this.setState({ input_focused: false });
							}
						}}
					>
						<span className="eyeglass material-icons">search</span>
						<input
							type="text"
							placeholder="Search by game name"
							onFocus={event => {
								this.setState({ input_focused: true });
								this.search(event.target.value);
							}}
							onChange={event => this.search(event.target.value)}
						></input>
						<div className="suggested">
							{this.state.input_focused &&
								this.state.suggested.length !== 0 &&
								this.state.suggested}
						</div>
					</div>
				</nav>
				<Outlet />
			</>
		);
	}
}
