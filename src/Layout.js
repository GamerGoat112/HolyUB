import { Component } from 'react';

const themes = ['night', 'day'];

export default class Layout extends Component {
	state = {
		fullscreen: this.get_fullscreen(),
		theme: this.get_theme(),
	};
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
	constructor(props) {
		super(props);
		this.listen_fullscreen = this.listen_fullscreen.bind(this);
	}
	componentDidMount() {
		document.addEventListener('fullscreenchange', this.listen_fullscreen);
	}
	componentWillUnmount() {
		document.removeEventListener('fullscreenchange', this.listen_fullscreen);
	}
	update() {
		this.set_theme(this.state.theme);
	}
	dataset() {
		document.documentElement.dataset.theme = this.state.theme;
		document.documentElement.dataset.fullscreen = Number(this.state.fullscreen);
	}
}
