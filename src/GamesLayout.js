import { Obfuscated } from './obfuscate.js';
import { Outlet, Link } from 'react-router-dom';
import { Component } from 'react';

export const games_base = new URL('/games/', global.location);

export class Item extends Component {
	state = {
		search: false,
	};
	get layout() {
		return this.props.layout.current;
	}
	get service_frame() {
		return this.layout.service_frame.current;
	}
	open() {
		switch (this.props.target) {
			case 'proxy':
				this.service_frame.proxy(this.props.src, this.props.name);
				break;
			case 'embed':
				this.service_frame.embed(this.props.src, this.props.name);
				break;
			case 'flash':
				this.service_frame.embed(
					`/proxies/flash.html#${this.props.src}`,
					this.props.name
				);
				break;
			case 'webretro':
				this.service_frame.embed(
					new URL(
						'webretro?' +
							new URLSearchParams({
								rom: this.props.src,
								core: 'autodetect',
							}),
						games_base
					),
					this.props.name
				);
				break;
			default:
				throw new TypeError(`Unrecognized target: ${this.props.target}`);
		}
	}
	render() {
		const style = {
			backgroundPosition: `${this.props.index * 200 * -1}px 0px`,
		};

		return (
			<div className="item" onClick={this.open.bind(this)}>
				<div className="front" style={style}></div>
				<div className="name">
					<Obfuscated>{this.props.name}</Obfuscated>
				</div>
			</div>
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
