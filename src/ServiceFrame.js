import root, { BARE_API } from './root.js';
import { ReactComponent as GlobeSVG } from './assets/globe.svg';
import SleepingComponent from './SleepingComponent';
import { createRef } from 'react';
import { render } from 'react-dom';
import { Obfuscated } from './obfuscate.js';
import SearchBuilder from './SearchBuilder.js';
import BareClient from 'bare-client';
import resolve_proxy from './ProxyResolver.js';
import './styles/Service.scss';

export default class ServiceFrame extends SleepingComponent {
	state = {
		title: '',
		icon: 'globe',
		// if icon is a blob: uri, revoke it once loaded
		revoke_icon: false,
		src: '',
		embed: {
			current: false,
		},
		proxy: {
			current: false,
			src: '',
		},
		first_load: false,
	};
	links_tried = new WeakMap();
	iframe = createRef();
	// headless client for serviceworker
	headless = createRef();
	search = new SearchBuilder('https://www.google.com/search?q=%s');
	bare = new BareClient(BARE_API);
	/**
	 * @returns {import('react').RefObject<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	async embed(src, title = src, icon = 'globe') {
		await this.setState({
			title,
			src,
			icon,
			embed: {
				current: true,
				src,
			},
		});
	}
	async proxy(input) {
		const src = this.search.query(input);

		const proxied_src = await resolve_proxy(
			src,
			this.layout.current.settings.get('proxy')
		);

		await this.setState({
			title: src,
			src: proxied_src,
			icon: 'globe',
			proxy: {
				current: true,
				src,
			},
		});
	}
	focus_listener() {
		this.iframe.current.contentWindow.focus();
	}
	constructor(props) {
		super(props);

		this.focus_listener = this.focus_listener.bind(this);
	}
	async componentDidMount() {
		window.addEventListener('focus', this.focus_listener);

		while (!this.unmounting) {
			if (this.state.proxy.current) {
				this.test_proxy_update();
			}

			await this.sleep(100);
		}
	}
	async componentWillUnmount() {
		window.removeEventListener('focus', this.focus_listener);
		super.componentWillUnmount();
	}
	test_proxy_update() {
		let location;

		// * didn't hook our call to new Function
		try {
			location = new this.iframe_window.Function('return location')();
		} catch (error) {
			// possibly an x-frame error
			return;
		}

		const titles = [];

		if (location === this.iframe_window.location) {
			titles.push(this.state.proxy.src);
		} else {
			const current_title = this.iframe_window.document.title;

			if (current_title === '') {
				titles.push(location.href);
			} else {
				titles.push(current_title);
			}

			const selector =
				this.iframe_window.document.querySelector('link[rel*="icon"]');

			const icons = [];

			if (selector !== null && selector.href !== '') {
				icons.push(selector.href);
			} else {
				icons.push(new URL('/favicon.ico', location).href);
			}

			if (!this.links_tried.has(location)) {
				this.links_tried.set(location, new Set());
			}

			if (!this.links_tried.get(location).has(icons[0])) {
				this.links_tried.get(location).add(icons[0]);
				this.load_icon(icons[0]);
			}
		}

		this.setState({
			title: titles[0],
		});
	}
	/**
	 * @returns {Window}
	 */
	get iframe_window() {
		return this.iframe.current.contentWindow;
	}
	add_fields(datalist, _fields) {
		const fields = [..._fields];

		for (let i = 0; i < fields.length; i++) {
			fields[i] = <option key={fields[i]} value={fields[i]} />;
		}

		render(fields, datalist);
	}
	async omnibox_entries(query) {
		const entries = [];

		try {
			if (this.abort !== undefined) {
				this.abort.abort();
			}

			this.abort = new AbortController();

			const outgoing = await this.bare.fetch(
				'https://www.bing.com/AS/Suggestions?' +
					new URLSearchParams({
						qry: query,
						cvid: '\u0001',
						bareServer: true,
					}),
				{
					signal: this.abort.signal,
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
			} else if (error.message !== 'The user aborted a request.') {
				throw error;
			}
		}

		return entries;
	}
	// cant set image src to serviceworker url unless the page is a client
	async load_icon(icon) {
		const outgoing = await this.bare.fetch(icon);

		this.setState({
			icon: URL.createObjectURL(await outgoing.blob()),
			revoke_icon: true,
		});
	}
	on_icon_error() {
		this.state.icon = 'globe';
	}
	on_icon_load() {
		if (this.state.revoke_icon) {
			this.setState({
				revoke_icon: false,
			});

			URL.revokeObjectURL(this.state.icon);
		}
	}
	close() {
		this.setState({
			src: '',
			first_load: false,
			proxy: {
				current: false,
			},
			embed: {
				current: false,
			},
		});
	}
	fullscreen() {
		root.requestFullscreen();
	}
	render() {
		let current;

		if (this.state.embed.current) {
			current = 'embed';
			document.documentElement.dataset.service = 1;
		} else if (this.state.proxy.current) {
			current = 'proxy';
			document.documentElement.dataset.service = 1;
		} else {
			delete document.documentElement.dataset.service;
		}

		return (
			<div className="service" ref={this.container} data-current={current}>
				<div className="buttons">
					<div
						className="material-icons button"
						onClick={this.close.bind(this)}
					>
						chevron_left
					</div>
					{this.state.icon === 'globe' ? (
						<GlobeSVG className="icon" />
					) : (
						<img
							className="icon"
							alt=""
							src={this.state.icon}
							onError={this.on_icon_error.bind(this)}
							onLoad={this.on_icon_load.bind(this)}
						/>
					)}
					<p className="title">
						<Obfuscated ellipsis>{this.state.title}</Obfuscated>
					</p>
					<div className="shift-right"></div>
					<div
						className="material-icons button"
						onClick={this.fullscreen.bind(this)}
					>
						fullscreen
					</div>
				</div>
				<iframe
					className="headless"
					title="headless"
					ref={this.headless}
				></iframe>
				<iframe
					className="embed"
					src={this.state.src}
					title="embed"
					ref={this.iframe}
					data-first-load={Number(this.state.first_load)}
					onLoad={() => {
						if (this.state.src !== '') {
							this.setState({ first_load: true });
						}
					}}
				></iframe>
			</div>
		);
	}
}
