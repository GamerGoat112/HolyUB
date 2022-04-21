import { Component, createRef } from 'react';
import { Obfuscated } from '../../obfuscate.js';
import { gamesAPI, gamesCDN, set_page } from '../../root.js';
import '../../styles/Games Player.scss';
import resolve_groxy from '../../ProxyResolver.js';
import Settings from '../../Settings.js';

function resolve_game(src, type, setting) {
	switch (type) {
		case 'proxy':
			return resolve_groxy(src, setting);
		case 'embed':
			return src;
		case 'flash':
			return `/proxies/flash.html#${src}`;
		case 'emulator':
		case 'emulator.gba':
		case 'emulator.nes':
		case 'emulator.genesis':
			return new URL(
				'webretro?' +
					new URLSearchParams({
						rom: src,
						core: 'autodetect',
					}),
				gamesCDN
			);
		default:
			throw new TypeError(`Unrecognized target: ${type}`);
	}
}

export default class GamesPlayer extends Component {
	settings = new Settings('common games', {
		favorites: [],
	});
	state = {
		favorited: this.settings.get('favorites').includes(this.id),
	};
	iframe = createRef();
	/**
	 * @returns {import('../Layout.js').default}
	 */
	get layout() {
		return this.props.layout;
	}
	get id() {
		const params = new URLSearchParams(global.location.search);

		return params.get('id');
	}
	abort = new AbortController();
	focus_listener() {
		this.iframe.current.contentWindow.focus();
	}
	constructor(props) {
		super(props);
		this.focus_listener = this.focus_listener.bind(this);
	}
	async componentDidMount() {
		window.addEventListener('focus', this.focus_listener);

		const outgoing = await fetch(new URL(`/games/${this.id}/`, gamesAPI));

		if (!outgoing.ok) {
			return this.setState({
				error: await outgoing.json(),
			});
		}

		this.setState({
			data: await outgoing.json(),
		});
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
					<button className="material-icons">
						{this.state.favorited ? 'favorite' : 'favorite_outlined'}
					</button>
				</div>
				<iframe
					ref={this.iframe}
					title="Embed"
					onFocus={() => this.focus_listener()}
					src={resolve_game(
						new URL(this.state.data.src, gamesCDN),
						this.state.data.type,
						this.layout.current.settings.get('proxy')
					)}
				/>
			</main>
		);
	}
}
