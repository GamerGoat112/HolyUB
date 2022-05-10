import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Component, createRef } from 'react';
import { Obfuscated } from '../../obfuscate.js';
import { DB_API, GAMES_CDN, HCAPTCHA_KEY, set_page } from '../../root.js';
import resolve_proxy from '../../ProxyResolver.js';
import { GamesAPI } from '../../GamesCommon.js';
import Settings from '../../Settings.js';
import '../../styles/GamesPlayer.scss';
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

async function resolve_game(src, type, setting) {
	switch (type) {
		case 'proxy':
			return await resolve_proxy(src, setting);
		case 'embed':
			return src;
		case 'flash':
			return `/compat/flash.html#${src}`;
		case 'emulator':
		case 'emulator.gba':
		case 'emulator.nes':
		case 'emulator.genesis':
			return (
				'/webretro/?' +
				new URLSearchParams({
					rom: src,
					core: 'autodetect',
				})
			);
		default:
			throw new TypeError(`Unrecognized target: ${type}`);
	}
}

export default class GamesPlayer extends Component {
	state = {
		controls_expanded: false,
		panorama: false,
	};
	api = new GamesAPI(DB_API);
	settings = new Settings('common games', {
		favorites: [],
		seen: [],
	});
	get favorited() {
		return this.settings.get('favorites').includes(this.props.id);
	}
	get seen() {
		return this.settings.get('seen').includes(this.props.id);
	}
	set seen(value) {
		const seen = this.settings.get('seen');

		if (value) {
			seen.push(this.props.id);
		} else {
			const i = seen.indexOf(this.props.id);
			seen.splice(i, 1);
		}

		this.settings.set('seen', seen);
	}
	captcha = createRef();
	iframe = createRef();
	controls_open = createRef();
	controls_popup = createRef();
	/**
	 * @returns {import('react').Ref<import('../../GamesLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	abort = new AbortController();
	focus_listener() {
		if (!this.iframe.current) {
			return;
		}

		this.iframe.current.contentWindow.focus();

		if (
			document.activeElement &&
			!this.iframe.current.contains(document.activeElement)
		) {
			document.activeElement.blur();
			document.activeElement.dispatchEvent(new Event('blur'));
		}
	}
	id = Math.random();
	constructor(props) {
		super(props);
		this.focus_listener = this.focus_listener.bind(this);
	}
	async componentDidMount() {
		window.addEventListener('focus', this.focus_listener);

		await {};

		try {
			const data = await this.api.game(this.props.id);
			const resolved_src = await resolve_game(
				new URL(data.src, GAMES_CDN).toString(),
				data.type,
				this.layout.current.settings.get('proxy')
			);
			await this.setState({ data, resolved_src });
		} catch (error) {
			console.error(error);
			this.setState({ error });
			return;
		}
	}
	componentWillUnmount() {
		window.removeEventListener('focus', this.focus_listener);
		this.abort.abort();
	}
	render() {
		set_page('games-player');

		if (this.state.error !== undefined) {
			return (
				<main className="error">
					<p>
						Encountered an error when loading the <Obfuscated>game</Obfuscated>:
					</p>
					<pre>{this.state.error.message}</pre>
				</main>
			);
		}

		if (this.state.data === undefined) {
			return (
				<main>
					<span>
						Fetching <Obfuscated>game</Obfuscated> info...
					</span>
				</main>
			);
		}

		const controls = [];

		for (let control of this.state.data.controls) {
			const visuals = [];

			for (let key of control.keys) {
				switch (key) {
					case 'arrows':
						visuals.push(
							<div key={key} className="move">
								<ArrowDropUp className="control-key" />
								<ArrowLeft className="control-key" />
								<ArrowDropDown className="control-key" />
								<ArrowRight className="control-key" />
							</div>
						);
						break;
					case 'wasd':
						visuals.push(
							<div key={key} className="move">
								<div className="control-key">W</div>
								<div className="control-key">A</div>
								<div className="control-key">S</div>
								<div className="control-key">D</div>
							</div>
						);
						break;
					default:
						visuals.push(
							<div key={key} className={`control-key key-${key}`}>
								{key}
							</div>
						);
						break;
				}
			}

			controls.push(
				<div key={control.label} className="control">
					<div className="visuals">{visuals}</div>
					<span className="label">{control.label}</span>
				</div>
			);
		}

		return (
			<main
				data-panorama={Number(this.state.panorama)}
				data-controls={Number(this.state.controls_expanded)}
			>
				<div className="frame">
					<iframe
						ref={this.iframe}
						title="Embed"
						onLoad={() => {
							this.iframe.current.contentWindow.addEventListener(
								'keydown',
								event => {
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
							);
						}}
						onClick={() => this.focus_listener()}
						onFocus={() => this.focus_listener()}
						src={this.state.resolved_src}
					/>
					<div
						tabIndex="0"
						className="controls"
						ref={this.controls_popup}
						onBlur={event => {
							if (
								!event.target.contains(event.relatedTarget) &&
								!this.controls_open.current.contains(event.relatedTarget)
							) {
								this.setState({ controls_expanded: false });
							}
						}}
					>
						<Close
							className="close"
							onClick={() => this.setState({ controls_expanded: false })}
						/>
						<div className="controls">{controls}</div>
					</div>
				</div>
				<div className="title">
					<h3 className="name">
						<Obfuscated>{this.state.data.name}</Obfuscated>
					</h3>
					<div className="shift-right"></div>
					<div
						className="button"
						onClick={() => {
							this.focus_listener();
							this.iframe.current.requestFullscreen();
						}}
					>
						<Fullscreen />
					</div>
					{controls.length !== 0 && (
						<div
							className="button"
							ref={this.controls_open}
							onClick={async () => {
								await this.setState({
									controls_expanded: !this.state.controls_expanded,
								});

								this.controls_popup.current.focus();
							}}
						>
							<VideogameAsset />
						</div>
					)}
					<div
						className="button"
						onClick={() => {
							const favorites = this.settings.get('favorites');
							const i = favorites.indexOf(this.props.id);

							if (i === -1) {
								favorites.push(this.props.id);
							} else {
								favorites.splice(i, 1);
							}

							this.settings.set('favorites', favorites);
							this.forceUpdate();
						}}
					>
						{this.favorited ? <Star /> : <StarBorder />}
					</div>
					<div
						className="button"
						onClick={async () => {
							await this.setState({
								panorama: !this.state.panorama,
							});

							if (this.state.panorama) {
								this.focus_listener();
							}
						}}
					>
						{this.state.panorama ? <ChevronLeft /> : <Panorama />}
					</div>
				</div>
				<HCaptcha
					onLoad={async () => {
						if (!this.seen) {
							await this.captcha.current.ready;
							this.captcha_seen = true;
							await this.captcha.current.execute();
						}
					}}
					onVerify={async token => {
						if (this.captcha_seen === true) {
							this.captcha_seen = false;
							await this.api.game_plays(this.props.id, token);
							this.seen = true;
						}
					}}
					sitekey={HCAPTCHA_KEY}
					size="invisible"
					ref={this.captcha}
				/>
			</main>
		);
	}
}
