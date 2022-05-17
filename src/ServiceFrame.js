import { BARE_API } from './root.js';
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { Obfuscated } from './obfuscate.js';
import SearchBuilder from './SearchBuilder.js';
import BareClient from 'bare-client';
import resolve_proxy from './ProxyResolver.js';
import { ChevronLeft, Fullscreen, Public } from '@mui/icons-material';
import './styles/Service.scss';
import useRefDefault from './useRefDefault.js';

export default forwardRef((props, ref) => {
	const iframe = useRef();
	const links_tried = useRef(new WeakMap());
	const proxy = useRef();
	const [title, set_title] = useState('');
	const [src, set_src] = useState('');
	const [icon, set_icon] = useState('');
	const [first_load, set_first_load] = useState(false);
	const [revoke_icon, set_revoke_icon] = useState(false);
	const abort = useRef();
	const bare = useRefDefault(() => new BareClient(BARE_API));

	useEffect(() => {
		function focus_listener() {
			iframe.current.contentWindow.focus();
		}

		window.addEventListener('focus', focus_listener);

		return () => {
			window.removeEventListener('focus', focus_listener);
		};
	}, [iframe]);

	useEffect(() => {
		async function test_proxy_update() {
			const { contentWindow } = iframe.current;

			let location;

			// * didn't hook our call to new Function
			try {
				location = new contentWindow.Function('return location')();
			} catch (error) {
				// possibly an x-frame error
				return;
			}

			let title;

			if (location === contentWindow.location) {
				title = proxy.current;
			} else {
				const current_title = contentWindow.document.title;

				if (current_title) {
					title = current_title;
				} else {
					title = location.toString();
				}

				const selector =
					contentWindow.document.querySelector('link[rel*="icon"]');

				let icon;

				if (selector !== null && selector.href !== '') {
					icon = selector.href;
				} else {
					icon = new URL('/favicon.ico', location).toString();
				}

				if (!links_tried.current.has(location)) {
					links_tried.current.set(location, new Set());
				}

				if (!links_tried.current.get(location).has(icon)) {
					links_tried.current.get(location).add(icon);

					const outgoing = await bare.current.fetch(icon);

					set_icon(URL.createObjectURL(await outgoing.blob()));
					set_revoke_icon(true);
				}
			}

			set_title(title);
		}

		const interval = setInterval(() => test_proxy_update(), 100);

		test_proxy_update();
		return () => clearInterval(interval);
	}, [proxy, bare, src, iframe]);

	useImperativeHandle(ref, () => ({
		async omnibox_entries(query) {
			const entries = [];

			try {
				if (abort.current !== undefined) {
					abort.current.abort();
				}

				abort.current = new AbortController();

				const outgoing = await bare.current.fetch(
					'https://www.bing.com/AS/Suggestions?' +
						new URLSearchParams({
							qry: query,
							cvid: '\u0001',
							bareServer: true,
						}),
					{
						signal: abort.current.signal,
					}
				);

				if (outgoing.ok) {
					const text = await outgoing.text();

					for (let [, phrase] of text.matchAll(
						/<span class="sa_tm_text">(.*?)<\/span>/g
					)) {
						entries.push(phrase);
					}
				} else {
					throw await outgoing.text();
				}
			} catch (error) {
				// likely abort error
				if (error.message === 'Failed to fetch') {
					console.error('Error fetching Bare server.');
				} else if (
					!error.message.includes('The operation was aborted') &&
					!error.message.includes('The user aborted a request.')
				) {
					throw error;
				}
			}

			return entries;
		},
		async proxy(input) {
			const builder = new SearchBuilder(
				props.layout.current.settings.get('search')
			);

			const src = builder.query(input);

			const proxied_src = await resolve_proxy(
				src,
				props.layout.current.settings.get('proxy')
			);

			proxy.current = src;
			set_title(src);
			set_src(proxied_src);
			set_first_load(false);
			set_icon('');
		},
	}));

	document.documentElement.dataset.service = Number(Boolean(src));

	return (
		<div className="service">
			<div className="buttons">
				<ChevronLeft
					className="button"
					onClick={() => {
						set_src('');
					}}
				/>
				{icon ? (
					<img
						className="icon"
						alt=""
						src={icon}
						onError={() => set_icon('')}
						onLoad={() => {
							if (revoke_icon) {
								URL.revokeObjectURL(icon);
								set_revoke_icon(false);
							}
						}}
					/>
				) : (
					<Public className="icon" />
				)}
				<p className="title">
					<Obfuscated ellipsis>{title}</Obfuscated>
				</p>
				<div className="shift-right"></div>
				<Fullscreen className="button" />
			</div>
			<iframe
				className="embed"
				src={src}
				title="embed"
				ref={iframe}
				data-first-load={Number(first_load)}
				onLoad={() => {
					if (src !== '') {
						set_first_load(true);
					}
				}}
			></iframe>
		</div>
	);
});
