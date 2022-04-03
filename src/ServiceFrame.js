import root, { bareCDN } from './root.js';
import GenericGlobeSVG from './Assets/generic-globe.svg';
import SleepingComponent from './SleepingComponent';
import { createRef } from 'react';
import { render } from 'react-dom';
import process from 'process';
import obfuscate from './obfuscate.js';

export default class ServiceFrame extends SleepingComponent {
	state = {
		title: '',
		icon: GenericGlobeSVG,
		// if icon is a blob: uri, revoke it once loaded
		revoke_icon: false,
		src: 'about:blank',
		embed: {
			current: false,
		},
		proxy: {
			current: false,
		},
	};
	links_tried = new WeakMap();
	iframe = createRef();
	// headless client for serviceworker
	headless = createRef();
	async embed(src, title = src, icon = GenericGlobeSVG) {
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
		await this.boot.ready;

		const src = this.search.query(input);

		await this.setState({
			title: src,
			src: this.boot.html(src),
			icon: GenericGlobeSVG,
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

		let config = {
			bare: bareCDN,
			directory: '/tomp/',
		};

		const TOMPBoot = await new Promise(resolve => {
			if (global.TOMPBoot) {
				resolve(global.TOMPBoot);
			} else {
				const interval = setInterval(() => {
					if (typeof global.TOMPBoot === 'function') {
						resolve(global.TOMPBoot);
						clearInterval(interval);
					}
				}, 75);
			}
		});

		if (process.env.NODE_ENV === 'development') {
			config.loglevel = TOMPBoot.LOG_TRACE;
			config.codec = TOMPBoot.CODEC_PLAIN;
		} else {
			config.loglevel = TOMPBoot.LOG_ERROR;
			config.codec = TOMPBoot.CODEC_XOR;
		}

		this.boot = new TOMPBoot(config);
		this.search = new TOMPBoot.SearchBuilder(
			'https://www.google.com/search?q=%s'
		);

		await this.boot.ready;

		this.ready = new Promise(resolve => {
			this.headless.current.addEventListener('load', resolve);
			this.headless.current.src = this.boot.config.directory;
		});

		await this.ready;

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
				this.load_icon(this.boot.binary(icons[0]));
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
		const results = [];

		if (query === '') {
			return results;
		}

		try {
			await this.ready;

			if (this.abort !== undefined) {
				this.abort.abort();
			}

			this.abort = new AbortController();

			const outgoing = await fetch(new URL('v2/', bareCDN), {
				headers: {
					'x-bare-path':
						'/ac/?' +
						new URLSearchParams({
							q: query,
							kl: 'wt-wt',
						}),
					'x-bare-headers': JSON.stringify({
						host: 'duckduckgo.com',
					}),
					'x-bare-host': 'duckduckgo.com',
					'x-bare-port': '443',
					'x-bare-protocol': 'https:',
				},
				signal: this.abort.signal,
			});

			if (outgoing.ok && outgoing.headers.get('x-bare-status') === '200') {
				for (let { phrase } of await outgoing.json()) {
					results.push(phrase);
				}
			} else {
				throw await outgoing.json();
			}
		} catch (error) {
			// likely abort error
			if (error.message === 'Failed to fetch') {
				console.error('Error fetching TOMP/Bare server.');
			} else if (error.message !== 'The user aborted a request.') {
				throw error;
			}
		}

		for (let i = 0; i < results.length; i++) {
			results[i] = <option key={i} value={results[i]} />;
		}

		return results;
	}
	// cant set image src to serviceworker url unless the page is a client
	async load_icon(icon) {
		const outgoing = await this.client_fetch(icon);

		this.setState({
			icon: URL.createObjectURL(await outgoing.blob()),
			revoke_icon: true,
		});
	}
	on_icon_error(event) {
		this.state.icon = GenericGlobeSVG;
	}
	on_icon_load(event) {
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
			root.dataset.service = 1;
		} else if (this.state.proxy.current) {
			current = 'proxy';
			root.dataset.service = 1;
		} else {
			delete root.dataset.service;
		}

		return (
			<div className="service" ref={this.container} data-current={current}>
				<div className="buttons">
					<div className="button" onClick={this.close.bind(this)}>
						<span className="material-icons">chevron_left</span>
					</div>
					<img
						className="icon"
						alt=""
						src={this.state.icon}
						onError={this.on_icon_error.bind(this)}
						onLoad={this.on_icon_load.bind(this)}
					/>
					<p className="title">{obfuscate(<>{this.state.title}</>)}</p>
					<div className="shift-right"></div>
					<div className="button" onClick={this.fullscreen.bind(this)}>
						<span className="material-icons">fullscreen</span>
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
				></iframe>
			</div>
		);
	}
}
