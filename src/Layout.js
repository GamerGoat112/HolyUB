import { Component } from 'react';
import Settings from './Settings.js';

export const THEMES = ['night', 'day'];

export default class Layout extends Component {
	state = {
		fullscreen: this.get_fullscreen(),
	};
	settings = new Settings(
		'global settings',
		{
			theme: THEMES[0],
			proxy: 'auto',
		},
		this
	);
	last_theme = this.state.theme;
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
		document.documentElement.dataset.theme = this.settings.get('theme');
		document.documentElement.dataset.fullscreen = Number(this.state.fullscreen);
	}
}
