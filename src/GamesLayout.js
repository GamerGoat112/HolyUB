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
		...this.state,
		expanded: false,
		search: false,
		suggested: [],
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
				<Link id={game.id} to={`/games/player.html?id=${game.id}`}>
					<div key={game.id}>
						<div className="name">{game.name}</div>
						<div className="category">
							{game.category in categories
								? categories[game.category].name
								: console.warn(game.cateogry)}
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
				<nav
					className="games"
					data-search={Number(this.state.search)}
					data-expanded={Number(this.state.expanded)}
				>
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
						<Link to="/games/popular.html" className="entry text">
							<span>Popular</span>
						</Link>
						<Link to="/games/favorites.html" className="entry text">
							<span>Favorites</span>
						</Link>
						{this.categories}
					</div>
					<div className="shift-right" />
					<button
						className="search"
						onClick={() =>
							this.setState({
								search: true,
							})
						}
					>
						<span className="material-icons">search</span>
					</button>
					<div
						className="search-bar"
						data-suggested={Number(this.state.suggested.length !== 0)}
					>
						<div className="button button-search material-icons">search</div>
						<input
							type="text"
							placeholder="Search by game name"
							onChange={event => this.search(event.target.value)}
						></input>
						<div className="suggested">{this.state.suggested}</div>
						<button
							className="button button-close material-icons"
							onClick={() =>
								this.setState({
									search: false,
								})
							}
						>
							close
						</button>
					</div>
				</nav>
				<Outlet />
			</>
		);
	}
}
