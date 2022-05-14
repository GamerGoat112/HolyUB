import { CheckCircle, Error, Info, Warning } from '@mui/icons-material';
import clsx from 'clsx';
import { Component, createRef, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

function ScrollManager() {
	const location = useLocation();
	const _scrolls = useRef(new Map());
	const { current: scrolls } = _scrolls;

	// last_page === undefined on refresh
	const last_page = useRef();

	if (last_page.current !== location.pathname) {
		if (last_page.current) {
			scrolls.set(last_page.current, new Scroll());
		}

		if (scrolls.has(location.pathname)) {
			scrolls.get(location.pathname).scroll();
		}

		last_page.current = location.pathname;
	}

	return <></>;
}
const ANIMATION = 1.5e3;

/**
 *
 * @param {{manager: NotificationsManager, id: string, type: 'warning'|'error'|'sucess'|'info', duration: number, title: JSX.Element, description: JSX.Element}} props
 */
export function Notification(props) {
	const [hide, set_hide] = useState(false);

	const duration = props.duration || 5e3;

	useEffect(() => {
		setTimeout(() => {
			set_hide(true);
			setTimeout(() => props.manager.delete(props.id), ANIMATION);
		}, duration);
	});

	let Icon;

	switch (props.type) {
		case 'warning':
			Icon = Warning;
			break;
		case 'error':
			Icon = Error;
			break;
		case 'success':
			Icon = CheckCircle;
			break;
		default:
		case 'info':
			Icon = Info;
			break;
	}

	return (
		<div
			className={clsx('notification', hide && 'hide', props.title && 'title')}
		>
			<Icon className={`icon ${props.type}`} />
			<div className="content">
				{props.title && <div className="title">{props.title}</div>}
				{props.description && (
					<div className="description">{props.description}</div>
				)}
			</div>
			<div
				className="timer"
				style={{ animationDuration: `${duration / 1000}s` }}
			/>
		</div>
	);
}

class NotificationsManager extends Component {
	/**
	 * @type {Notification[]}
	 */
	notifications = [];
	animations = [];
	/**
	 *
	 * @param {Notification} notification
	 */
	add(notification) {
		const id = Math.random();

		this.notifications.push(
			<Notification {...notification.props} key={id} id={id} manager={this} />
		);

		this.forceUpdate();
	}
	/**
	 *
	 * @param {string} id
	 */
	delete(id) {
		for (let i = 0; i < this.notifications.length; i++) {
			const notification = this.notifications[i];

			console.log(notification.props.id, id);
			if (notification.props.id !== id) {
				continue;
			}

			this.notifications.splice(i, 1);
			this.forceUpdate();

			return true;
		}

		return false;
	}
	render() {
		return <div className="notifications">{this.notifications}</div>;
	}
}

export default class Layout extends Component {
	notifications = createRef();
	state = {
		fullscreen: this.get_fullscreen(),
		expanded: false,
	};
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
	render() {
		document.documentElement.dataset.theme = this.settings.get('theme');
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

		return (
			<>
				<NotificationsManager ref={this.notifications} />
				<ScrollManager />
			</>
		);
	}
}
