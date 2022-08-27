import './styles/Service.scss';
import type { LayoutRef } from './Layout';
import { Notification } from './Notifications';
import resolveProxy from './ProxyResolver';
import { BARE_API } from './consts';
import { decryptURL, encryptURL } from './cryptURL';
import { Obfuscated } from './obfuscate';
import {
	ChevronLeft,
	Fullscreen,
	OpenInNew,
	Public,
} from '@mui/icons-material';
import BareClient from '@tomphttp/bare-client';
import type { RefObject } from 'react';
import { useRef } from 'react';
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

export default forwardRef<
	{
		proxy(src: string): void;
	},
	{ layout: RefObject<LayoutRef> }
>(function ServiceFrame({ layout }, ref) {
	const iframe = useRef<HTMLIFrameElement | null>(null);
	const [search, setSearch] = useSearchParams();
	const [firstLoad, setFirstLoad] = useState(false);
	const [revokeIcon, setRevokeIcon] = useState(false);
	const [lastSrc, setLastSrc] = useState('');
	const bare = useMemo(() => new BareClient(BARE_API), []);
	const linksTried = useMemo(() => new WeakMap(), []);

	const src = useMemo(
		() => (search.has('query') ? decryptURL(search.get('query')!) : ''),
		[search]
	);
	const [title, setTitle] = useState(src);
	const [icon, setIcon] = useState('');

	useEffect(() => {
		if (src) {
			(async function () {
				if (
					!layout.current ||
					!layout.current.notifications.current ||
					!iframe.current ||
					!iframe.current.contentWindow
				)
					return;

				try {
					const proxiedSrc = await resolveProxy(
						src,
						layout.current.settings.proxy
					);

					iframe.current.contentWindow.location.href = proxiedSrc;
					setLastSrc(proxiedSrc);
				} catch (error) {
					console.error(error);
					layout.current.notifications.current.add(
						<Notification
							title="Unable to find compatible proxy"
							description={
								error instanceof Error ? error.message : String(error)
							}
							type="error"
						/>
					);
				}
			})();
		} else {
			if (!iframe.current || !iframe.current.contentWindow) return;

			setFirstLoad(false);
			setTitle('');
			setIcon('');
			iframe.current.contentWindow.location.href = 'about:blank';
			setLastSrc('about:blank');
		}
	}, [iframe, layout, src]);

	useImperativeHandle(ref, () => ({
		proxy(src: string) {
			search.has('query') && decryptURL(search.get('query')! as string);
			setSearch({
				...Object.fromEntries(search),
				query: encryptURL(src),
			});
		},
	}));

	useEffect(() => {
		function focusListener() {
			if (!iframe.current || !iframe.current.contentWindow) return;

			iframe.current.contentWindow.focus();
		}

		window.addEventListener('focus', focusListener);

		return () => window.removeEventListener('focus', focusListener);
	}, [iframe]);

	const testProxyUpdate = useCallback(
		async function testProxyUpdate() {
			if (!iframe.current || !iframe.current.contentWindow) return;

			const contentWindow = iframe.current
				.contentWindow as unknown as typeof globalThis;

			// * didn't hook our call to new Function
			try {
				setLastSrc(contentWindow.location.href);
			} catch (error) {
				// possibly an x-frame error
				return;
			}

			const location = new contentWindow.Function('return location')();

			if (location === contentWindow.location) setTitle(src);
			else {
				const currentTitle = contentWindow.document.title;

				setTitle(currentTitle || location.toString());
				const selector = contentWindow.document.querySelector(
					'link[rel*="icon"]'
				) as HTMLLinkElement | undefined;

				const icon =
					selector && selector.href !== ''
						? selector.href
						: new URL('/favicon.ico', location).toString();

				if (!linksTried.has(location)) linksTried.set(location, new Set());

				if (!linksTried.get(location).has(icon)) {
					linksTried.get(location).add(icon);

					const outgoing = await bare.fetch(icon);

					setIcon(URL.createObjectURL(await outgoing.blob()));
					setRevokeIcon(true);
				}
			}
		},
		[bare, iframe, linksTried, src]
	);

	useEffect(() => {
		const interval = setInterval(testProxyUpdate, 50);
		testProxyUpdate();
		return () => clearInterval(interval);
	}, [testProxyUpdate]);

	useEffect(() => {
		document.documentElement.dataset.service = Number(Boolean(src)).toString();
	}, [src]);

	return (
		<div className="service">
			<div className="buttons">
				<ChevronLeft
					className="button"
					onClick={() => {
						search.delete('query');
						setSearch(search);
					}}
				/>
				{icon ? (
					<img
						className="icon"
						alt=""
						src={icon}
						onError={() => setIcon('')}
						onLoad={() => {
							if (revokeIcon) {
								URL.revokeObjectURL(icon);
								setRevokeIcon(false);
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
				<a href={lastSrc} className="button">
					<OpenInNew />
				</a>
				<Fullscreen
					className="button"
					onClick={() => iframe.current && iframe.current.requestFullscreen()}
				/>
			</div>
			<iframe
				className="embed"
				title="embed"
				ref={iframe}
				data-first-load={Number(firstLoad)}
				onLoad={() => {
					testProxyUpdate();

					if (src !== '') {
						setFirstLoad(true);
					}
				}}
			></iframe>
		</div>
	);
});
