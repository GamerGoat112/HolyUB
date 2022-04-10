import ServiceFrame from './ServiceFrame.js';
import obfuscate, { ObfuscateStyle } from './obfuscate.js';
import { Component, createRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './Styles/App.scss';

const themes = ['light', 'dark'];

export default class Layout extends Component {
	state = {
		search: false,
		fullscreen: this.get_fullscreen(),
		theme: this.get_theme(),
		expanded: false,
	};
	nav = createRef();
	search_bar = createRef();
	service_frame = createRef();
	collapsable = createRef();
	last_theme = this.state.theme;
	get_theme() {
		if (!themes.includes(localStorage.getItem('theme'))) {
			localStorage.setItem('theme', themes[0]);
		}

		return localStorage.getItem('theme');
	}
	set_theme(value) {
		if (this.last_theme === value) {
			return value;
		}

		if (!themes.includes(value)) {
			throw new RangeError('Bad theme');
		}

		localStorage.setItem('theme', value);

		return value;
	}
	get_fullscreen() {
		return document.fullscreenElement !== null;
	}
	listen_fullscreen() {
		this.setState({
			fullscreen: this.get_fullscreen(),
		});
	}
	listen_click(event) {
		if (this.collapsable.current.contains(event.target)) {
			this.setState({
				expanded: false,
			});
		}
	}
	constructor(props) {
		super(props);
		this.listen_fullscreen = this.listen_fullscreen.bind(this);
		this.listen_click = this.listen_click.bind(this);
	}
	componentDidMount() {
		document.addEventListener('fullscreenchange', this.listen_fullscreen);
		document.addEventListener('click', this.listen_click);
	}
	componentWillUnmount() {
		document.removeEventListener('fullscreenchange', this.listen_fullscreen);
		document.removeEventListener('click', this.listen_click);
	}
	lightswitch() {
		if (this.state.theme === 'light') {
			this.setState({
				theme: 'dark',
			});
		} else if (this.state.theme === 'dark') {
			this.setState({
				theme: 'light',
			});
		}
	}
	render() {
		document.documentElement.dataset.theme = this.state.theme;
		document.documentElement.fullscreen = Number(this.state.fullscreen);

		this.set_theme(this.state.theme);

		return (
			<>
				<ObfuscateStyle />
				<nav
					ref={this.nav}
					data-expanded={Number(this.state.expanded)}
					data-search={Number(this.state.search)}
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
					<Link to="/" className="entry logo text">
						Holy Unblocker
					</Link>
					<div className="separator"></div>
					<div className="collapsable" ref={this.collapsable}>
						<Link to="/proxy.html" className="entry text">
							<span>Proxy</span>
						</Link>
						<Link to="/theatre.html" className="entry text">
							<span>Theatre</span>
						</Link>
						<Link to="/support.html" className="entry text">
							<span>Support</span>
						</Link>
					</div>
					<div className="shift-right"></div>
					<button className="lightswitch" onClick={this.lightswitch.bind(this)}>
						<span className="material-icons">
							{this.state.theme === 'dark' ? 'brightness_7' : 'brightness_4'}
						</span>
					</button>
				</nav>
				<Outlet />
				<ServiceFrame ref={this.service_frame} />
				<footer>
					<Link to="/licenses.html">Licenses</Link>
					<Link to="/contact.html">Contact</Link>
					<Link to="/privacy.html">Privacy</Link>
					<Link to="/terms.html">Terms of use</Link>
					<span>
						{obfuscate(<>HolyUnblocker</>)} {new Date().getUTCFullYear()}
					</span>
				</footer>
			</>
		);
	}
}
