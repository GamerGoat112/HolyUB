import type { HolyPage } from '../../App';
import resolveProxy from '../../ProxyResolver';
import { TheatreAPI } from '../../TheatreCommon';
import type { TheatreEntry } from '../../TheatreCommon';
import { DB_API, THEATRE_CDN } from '../../consts';
import { encryptURL } from '../../cryptURL';
import isAbortError from '../../isAbortError';
import { Obfuscated } from '../../obfuscate';
import resolveRoute from '../../resolveRoute';
import styles from '../../styles/TheatrePlayer.module.scss';
import {
	ArrowDropDown,
	ArrowDropUp,
	ArrowLeft,
	ArrowRight,
	ChevronLeft,
	Close,
	Fullscreen,
	Panorama,
	Star,
	StarBorder,
	VideogameAsset,
} from '@mui/icons-material';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

async function resolveSrc(
	src: TheatreEntry['src'],
	type: TheatreEntry['type'],
	setting: string
) {
	switch (type) {
		case 'proxy':
			return await resolveProxy(src, setting);
		case 'embed':
			return src;
		case 'flash':
			return `${resolveRoute('/compat/', 'flash')}#${encryptURL(src)} `;
		case 'emulator':
		case 'emulator.gba':
		case 'emulator.nes':
		case 'emulator.genesis':
			return new URL(
				'./html5/webretro/?' +
					new URLSearchParams({
						rom: src,
						core: 'autodetect',
					}),
				THEATRE_CDN
			).toString();
		default:
			throw new TypeError(`Unrecognized target: ${type}`);
	}
}

const Player: HolyPage = ({ layout }) => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;
	if (!id) throw new Error('Bad ID');
	const [favorited, setFavorited] = useState(() =>
		layout.current!.settings.favorites.includes(id)
	);
	const [panorama, setPanorama] = useState(false);
	const [controlsExpanded, setControlsExpanded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const errorCause = useRef<string | null>(null);
	const [data, setData] = useState<TheatreEntry | null>(null);
	const iframe = useRef<HTMLIFrameElement | null>(null);
	const controlsOpen = useRef<HTMLDivElement | null>(null);
	const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
	const controlsPopup = useRef<HTMLDivElement | null>(null);
	const [seen, _setSeen] = useState(() =>
		layout.current!.settings.seen_games.includes(id)
	);

	useEffect(() => {
		const abort = new AbortController();

		async function setSeen(value: boolean) {
			const seen = layout.current!.settings.seen_games;

			if (value) {
				seen.push(id);
			} else {
				const i = seen.indexOf(id);
				seen.splice(i, 1);
			}

			layout.current!.setSettings({
				...layout.current!.settings,
				seen_games: seen,
			});

			_setSeen(value);
		}

		(async function () {
			const api = new TheatreAPI(DB_API, abort.signal);

			try {
				errorCause.current = 'Unable to fetch game info';
				const data = await api.show(id);
				errorCause.current = null;
				errorCause.current = 'Unable to resolve game location';
				const resolvedSrc = await resolveSrc(
					new URL(data.src, THEATRE_CDN).toString(),
					data.type,
					layout.current!.settings.proxy
				);
				errorCause.current = null;
				setData(data);
				setResolvedSrc(resolvedSrc);

				if (!seen) {
					errorCause.current = 'Unable to update plays';
					await api.plays(id);
					setSeen(true);
					errorCause.current = null;
				}
			} catch (error) {
				if (error instanceof Error && !isAbortError(error)) {
					console.error(error);
					setError(error.toString());
				}
			}
		})();

		return () => abort.abort();
	}, [seen, id, layout]);

	function focusListener() {
		if (!iframe.current) {
			return;
		}

		iframe.current!.contentWindow?.focus();

		if (
			document.activeElement &&
			document.activeElement instanceof HTMLElement &&
			!iframe.current.contains(document.activeElement)
		) {
			document.activeElement.blur();
			document.activeElement.dispatchEvent(new Event('blur'));
		}
	}

	useEffect(() => {
		window.addEventListener('focus', focusListener);

		focusListener();

		return () => window.removeEventListener('focus', focusListener);
	}, [data]);

	if (error) {
		return (
			<main className="error">
				<p>An error occurreds when loading the entry:</p>
				<pre>
					<Obfuscated>{errorCause.current || error}</Obfuscated>
				</pre>
			</main>
		);
	}

	if (!data) {
		return (
			<main
				className={clsx(styles.main, styles.loading)}
				data-panorama={Number(panorama)}
				data-controls={Number(controlsExpanded)}
			>
				<div className={styles.frame}></div>
				<div className={styles.title}>
					{
						// eslint-disable-next-line jsx-a11y/heading-has-content
						<h3 className={styles.name} />
					}
					<div className={styles.shiftRight}></div>
					<div className={styles.button} />
					<div className={styles.button} />
					<div className={styles.button} />
					<div className={styles.button} />
				</div>
			</main>
		);
	}

	const controls = [];

	for (const control of data.controls) {
		const visuals = [];

		for (const key of control.keys) {
			switch (key) {
				case 'arrows':
					visuals.push(
						<div key={key} className={styles.move}>
							<ArrowDropUp className={styles.controlKey} />
							<ArrowLeft className={styles.controlKey} />
							<ArrowDropDown className={styles.controlKey} />
							<ArrowRight className={styles.controlKey} />
						</div>
					);
					break;
				case 'wasd':
					visuals.push(
						<div key={key} className={styles.move}>
							<div className={styles.controlKey}>W</div>
							<div className={styles.controlKey}>A</div>
							<div className={styles.controlKey}>S</div>
							<div className={styles.controlKey}>D</div>
						</div>
					);
					break;
				default:
					visuals.push(
						<div
							key={key}
							className={clsx(styles.controlKey, styles[`key${key}`])}
						>
							{key}
						</div>
					);
					break;
			}
		}

		controls.push(
			<div key={control.label} className={styles.control}>
				<div className={styles.visuals}>{visuals}</div>
				<span className={styles.label}>{control.label}</span>
			</div>
		);
	}

	return (
		<main
			className={styles.main}
			data-panorama={Number(panorama)}
			data-controls={Number(controlsExpanded)}
		>
			<div className={styles.frame}>
				<iframe
					ref={iframe}
					title="Embed"
					onLoad={() => {
						iframe.current!.contentWindow?.addEventListener(
							'keydown',
							(event) => {
								if (
									event.target === iframe.current!.contentWindow?.document.body
								) {
									switch (event.code) {
										case 'Space':
										case 'ArrowUp':
										case 'ArrowDown':
										case 'ArrowLeft':
										case 'ArrowRight':
											event.preventDefault();
											break;
										// no default
									}
								}
							}
						);
					}}
					onClick={focusListener}
					onFocus={focusListener}
					src={resolvedSrc || undefined}
				/>
				<div
					tabIndex={0}
					className={styles.controls}
					ref={controlsPopup}
					onBlur={(event) => {
						if (
							!event.target.contains(event.relatedTarget) &&
							!controlsOpen.current!.contains(event.relatedTarget)
						) {
							setControlsExpanded(false);
						}
					}}
				>
					<Close
						className={styles.close}
						onClick={() => setControlsExpanded(false)}
					/>
					<div className={styles.controls}>{controls}</div>
				</div>
			</div>
			<div className={styles.title}>
				<h3 className={styles.name}>
					<Obfuscated>{data.name}</Obfuscated>
				</h3>
				<div className={styles.shiftRight}></div>
				<div
					className={styles.button}
					onClick={() => {
						focusListener();
						iframe.current!.requestFullscreen();
					}}
				>
					<Fullscreen />
				</div>
				{controls.length !== 0 && (
					<div
						className={styles.button}
						tabIndex={0}
						ref={controlsOpen}
						onClick={async () => {
							setControlsExpanded(!controlsExpanded);
							controlsPopup.current!.focus();
						}}
					>
						<VideogameAsset />
					</div>
				)}
				<div
					className={styles.button}
					onClick={() => {
						const favorites = layout.current!.settings.favorites;
						const i = favorites.indexOf(id);

						if (i === -1) {
							favorites.push(id);
						} else {
							favorites.splice(i, 1);
						}

						layout.current!.setSettings({
							...layout.current!.settings,
							favorites,
						});

						setFavorited(favorites.includes(id));
					}}
				>
					{favorited ? <Star /> : <StarBorder />}
				</div>
				<div
					className={styles.button}
					onClick={async () => {
						setPanorama(!panorama);

						if (!panorama) {
							focusListener();
						}
					}}
				>
					{panorama ? <ChevronLeft /> : <Panorama />}
				</div>
			</div>
		</main>
	);
};

export default Player;
