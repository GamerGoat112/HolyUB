import { Component } from 'react';
import Settings from './Settings.js';

export const THEMES = ['night', 'day'];

export default class Layout extends Component {
	state = {
		fullscreen: this.get_fullscreen(),
		expanded: true,
	};
	constructor(props) {
		super(props);

		let theme;

		const prefers_light = matchMedia('(prefers-color-scheme: light)');

		if (prefers_light.matches) {
			theme = 'day';
		} else {
			theme = 'night';
		}

		this.settings = new Settings(
			'global settings',
			{
				theme,
				proxy: 'automatic',
			},
			this
		);

		this.cloak = new Settings(
			'cloak settings',
			{
				url: '',
				title: '',
				icon: '',
			},
			this
		);

		this.listen_fullscreen = this.listen_fullscreen.bind(this);
	}
	get_fullscreen() {
		return document.fullscreenElement !== null;
	}
	listen_fullscreen() {
		this.setState({
			fullscreen: this.get_fullscreen(),
		});
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
		document.documentElement.dataset.expanded = Number(this.state.expanded);

		if (this.cloak.get('title') === '') {
			document.title = 'Holy Unblocker';
		} else {
			document.title = this.cloak.get('title');
		}
	}
	render() {
		if (this.cloak.get('icon') === '') {
			return <link rel="icon" href="/favicon.ico"></link>;
		} else {
			return <link rel="icon" href={this.cloak.get('icon')}></link>;
		}
	}
}
