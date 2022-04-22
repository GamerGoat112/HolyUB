import { Outlet, Link } from 'react-router-dom';
import { Component } from 'react';
import { set_page } from './root.js';
import categories from './pages/games/categories.json';
import './styles/Games.scss';

export default class GamesLayout extends Component {
	state = {
		...this.state,
		expanded: false,
		search: false,
	};
	componentDidMount() {
		set_page('games');
	}
	categories = [];
	constructor(props) {
		super(props);

		for (let { name, id } of categories) {
			this.categories.push(
				<Link key={id} to={`/games/${id}.html`} className="entry text">
					<span>{name}</span>
				</Link>
			);
		}
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
					<div className="search">
						<div className="button button-search material-icons">search</div>
						<input type="text" placeholder="Search by game name"></input>
						<div className="suggested"></div>
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
