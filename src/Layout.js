import NotificationsManager from './Notifications.js';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
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

export default forwardRef((props, ref) => {
	const notifications = useRef();
	const icon = document.querySelector('link[rel="icon"]');

	const theme = useMemo(() => {
		const { matches: prefers_light } = matchMedia(
			'(prefers-color-scheme: light)'
		);

		return prefers_light ? 'day' : 'night';
	}, []);

	const settings = useMemo(
		() =>
			new Settings('global settings', {
				theme,
				proxy: 'automatic',
				search: 'https://www.google.com/search?q=%s',
				favorite_games: [],
				seen_games: [],
			}),
		[theme]
	);

	const cloak = useMemo(
		() =>
			new Settings('cloak settings', {
				value: '',
				title: '',
				icon: '',
			}),
		[]
	);

	useImperativeHandle(
		ref,
		() => ({
			notifications,
			settings,
			cloak,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[notifications]
	);

	document.documentElement.dataset.theme = settings.get('theme');

	if (cloak.get('title') === '') {
		document.title = 'Holy Unblocker';
	} else {
		document.title = cloak.get('title');
	}

	let href;

	switch (cloak.get('icon')) {
		case '':
			href = '/favicon.ico';
			break;
		case 'none':
			href = 'data:,';
			break;
		default:
			href = cloak.get('icon');
			break;
	}

	icon.href = href;

	return (
		<>
			<NotificationsManager ref={notifications} />
			<ScrollManager />
		</>
	);
});
