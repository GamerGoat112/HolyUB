import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Component, createRef } from 'react';
import { Obfuscated } from '../../obfuscate.js';
import { gamesCDN, hcaptchaKey, set_page } from '../../root.js';
import resolve_proxy from '../../ProxyResolver.js';
import '../../styles/Games Player.scss';

function resolve_game(src, type, setting) {
	switch (type) {
		case 'proxy':
			return resolve_proxy(src, setting);
		case 'embed':
			return src;
		case 'flash':
			return `/proxies/flash.html#${src}`;
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
	state = {};
	get favorited() {
		return this.games_layout.current.settings
			.get('favorites')
			.includes(this.props.id);
	}
	get seen() {
		return this.games_layout.current.settings
			.get('seen')
			.includes(this.props.id);
	}
	set seen(value) {
		const seen = this.games_layout.current.settings.get('seen');

		if (value) {
			seen.push(this.props.id);
		} else {
			const i = seen.indexOf(this.props.id);
			seen.splice(i, 1);
		}

		this.games_layout.current.settings.set('seen', seen);
	}
	captcha = createRef();
	iframe = createRef();

	/**
	 * @returns {import('react').Ref<import('../../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	/**
	 * @returns {import('react').Ref<import('../../GamesLayout.js').default>}
	 */
	get games_layout() {
		return this.props.games_layout;
	}
	abort = new AbortController();
	focus_listener() {
		if (!this.iframe.current) {
			return;
		}

		this.iframe.current.contentWindow.focus();
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
			const data = await this.games_layout.current.api.game(this.props.id);
			await this.setState({ data });
		} catch (error) {
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
					Fetching <Obfuscated>game</Obfuscated> info...
				</main>
			);
		}

		const resolved = resolve_game(
			new URL(this.state.data.src, gamesCDN).toString(),
			this.state.data.type,
			this.layout.current.settings.get('proxy')
		);

		return (
			<main>
				<div className="title">
					<h3>
						<Obfuscated>{this.state.data.name}</Obfuscated>
					</h3>
					<div className="shift-right"></div>
					<button
						className="material-icons"
						onClick={() => {
							this.focus_listener();
							this.iframe.current.requestFullscreen();
						}}
					>
						fullscreen
					</button>
					<button
						className="material-icons"
						onClick={() => {
							this.focus_listener();

							this.iframe.current.scrollIntoView({
								behavior: 'auto',
								block: 'center',
								inline: 'center',
							});
						}}
					>
						vertical_align_center
					</button>
					<button
						className="material-icons"
						onClick={() => {
							const favorites =
								this.games_layout.current.settings.get('favorites');
							const i = favorites.indexOf(this.props.id);

							if (i === -1) {
								favorites.push(this.props.id);
							} else {
								favorites.splice(i, 1);
							}

							this.games_layout.current.settings.set('favorites', favorites);
							this.forceUpdate();
						}}
					>
						{this.favorited ? 'star' : 'star_outlined'}
					</button>
				</div>
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
					src={resolved}
				/>
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
							await this.games_layout.current.api.game_plays(
								this.props.id,
								token
							);
							this.seen = true;
						}
					}}
					sitekey={hcaptchaKey}
					size="invisible"
					ref={this.captcha}
				/>
			</main>
		);
	}
}
