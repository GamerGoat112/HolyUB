import root, { bareCDN } from './root.js';
import { ReactComponent as GlobeSVG } from './Assets/globe.svg';
import SleepingComponent from './SleepingComponent';
import { createRef } from 'react';
import { render } from 'react-dom';
import { Obfuscated } from './obfuscate.js';
import Settings from './Settings.js';
import SearchBuilder from './SearchBuilder.js';
import BareClient from 'bare-client';
import proxyCompat from './proxy.json';
import './Styles/Service.scss';

const default_settings = {
	proxy: 'auto',
};

export default class ServiceFrame extends SleepingComponent {
	settings = new Settings('service settings', default_settings);
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
	bare = new BareClient(bareCDN);
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
	compatible_proxy(src) {
		const { host } = new URL(src);

		for (let { domain, proxy } of proxyCompat.compatibility) {
			if (host === domain || host.endsWith(`.${domain}`)) {
				return proxy;
			}
		}

		return proxyCompat.default;
	}
	async proxy(input) {
		let src = this.search.query(input);

		let proxy = this.settings.get('proxy');

		if (proxy === 'auto') {
			proxy = this.compatible_proxy(src);
		}

		let proxied_src;

		switch (proxy) {
			default:
			case 'rh':
				proxied_src = `/proxies/rh.html#${src}`;
				break;
			case 'uv':
				proxied_src = `/proxies/uv.html#${src}`;
				break;
			case 'st':
				proxied_src = `/proxies/st.html#${src}`;
				break;
		}

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
		// tomp didn't hook our call to new Function
		const location = new this.iframe_window.Function('return location')();

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
				this.iframe_window.document.querySelector(`link[rel*='icon']`);

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

		/*if (query === '') {
			return entries;
		}*/

		try {
			if (this.abort !== undefined) {
				this.abort.abort();
			}

			this.abort = new AbortController();

			const outgoing = await this.bare.fetch(
				`https://www.google.com/complete/search?` +
					new URLSearchParams({
						q: query,
						client: 'android',
						bareServer: true,
					}),
				{
					signal: this.abort.signal,
				}
			);

			if (outgoing.ok) {
				let results = await outgoing.json();

				for (let [phrase] of results) {
					entries.push(phrase);
				}
			} else {
				throw await outgoing.json();
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
