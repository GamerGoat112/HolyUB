import { Component } from 'react';
import Settings from './Settings.js';

export const THEMES = ['night', 'day'];

class Scroll {
	constructor(
		x = document.documentElement.scrollLeft,
		y = document.documentElement.scrollTop
	) {
		this.x = x;
		this.y = y;
	}
	scroll() {
		document.documentElement.scrollTo(this.x, this.y);
	}
}

export default class Layout extends Component {
	state = {
		fullscreen: this.get_fullscreen(),
		expanded: false,
		page: '',
	};
	scrolls = new Map();
	icon = document.querySelector('link[rel="icon"]');
	get mobile() {
		const mobile = matchMedia('only screen and (max-width: 650px)');

		return mobile.matches;
	}
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
				search: 'https://www.google.com/search?q=%s',
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

		this.listen_fullscreen = this.fullscreen.bind(this);
		this.listen_keydown = this.keydown.bind(this);
	}
	get_fullscreen() {
		return document.fullscreenElement !== null;
	}
	fullscreen() {
		this.setState({
			fullscreen: this.get_fullscreen(),
		});
	}
	keydown(event) {
		if (this.state.expanded && event.key === 'Escape') {
			this.setState({
				expanded: false,
			});
		}
	}
	componentDidMount() {
		document.addEventListener('keydown', this.listen_keydown);
		document.addEventListener('fullscreenchange', this.listen_fullscreen);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.listen_keydown);
		document.removeEventListener('fullscreenchange', this.listen_fullscreen);
	}
	last_page = '';
	render() {
		if (this.state.page && this.last_page !== this.state.page) {
			this.scrolls.set(this.last_page, new Scroll());

			if (!this.scrolls.has(this.state.page)) {
				this.scrolls.set(this.state.page, new Scroll());
			}

			this.scrolls.get(this.state.page).scroll();
			this.last_page = this.state.page;
		}

		document.documentElement.dataset.theme = this.settings.get('theme');
		document.documentElement.dataset.page = this.state.page;
		document.documentElement.dataset.fullscreen = Number(this.state.fullscreen);
		document.documentElement.dataset.expanded = Number(this.state.expanded);

		if (this.cloak.get('title') === '') {
			document.title = 'Holy Unblocker';
		} else {
			document.title = this.cloak.get('title');
		}

		let href;

		switch (this.cloak.get('icon')) {
			case '':
				href = '/favicon.ico';
				break;
			case 'none':
				href = 'data:,';
				break;
			default:
				href = this.cloak.get('icon');
				break;
		}

		this.icon.href = href;

		return <></>;
	}
}
