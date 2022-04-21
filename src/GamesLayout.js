import { Obfuscated } from './obfuscate.js';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { Component } from 'react';
import { set_page } from './root.js';
import './styles/Games.scss';

export class Item extends Component {
	state = {
		search: false,
		redirect: '',
	};
	open() {
		this.setState({
			redirect:
				'/games/player.html?' +
				new URLSearchParams({
					id: this.props.id,
				}),
		});
	}
	render() {
		let redirect;

		if (this.state.redirect !== '') {
			redirect = <Navigate replace to={this.state.redirect} />;
		}

		return (
			<>
				{redirect}
				<div className="item" onClick={this.open.bind(this)}>
					{
						// todo: make <img src="...something with this.props.id in src"
					}
					<div className="front"></div>
					<div className="name">
						<Obfuscated>{this.props.name}</Obfuscated>
					</div>
				</div>
			</>
		);
	}
}

export default class GamesLayout extends Component {
	state = {
		...this.state,
		expanded: false,
		search: false,
	};
	render() {
		set_page('games');

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
