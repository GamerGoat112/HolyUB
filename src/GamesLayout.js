import { Outlet, Link } from 'react-router-dom';
import { Component } from 'react';
import { set_page } from './root.js';
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
						<Link to="/games/" className="entry text">
							<span>Popular</span>
						</Link>
						<Link to="/games/social.html" className="entry text">
							<span>Social Media</span>
						</Link>
						<Link to="/games/platformer.html" className="entry text">
							<span>Platformer</span>
						</Link>
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
						<input type="text" placeholder="Search by game name"></input>
						<div className="suggested"></div>
						<button
							className="button-search material-icons"
							onClick={() =>
								this.setState({
									search: false,
								})
							}
						>
							search
						</button>
						<button
							className="button-close material-icons"
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
