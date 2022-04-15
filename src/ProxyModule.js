import { Component } from 'react';
import Layout from './Layout.js';
import obfuscate from './obfuscate.js';
import { set_page } from './root.js';

export default class ProxyLayout extends Component {
	layout = new Layout();
	state = {
		error: undefined,
		possible_error: undefined,
	};
	name = 'Generic Proxy';
	scripts = new Map();
	load_script(src) {
		if (this.scripts.has(src)) {
			return Promise.resolve();
		}

		const script = document.createElement('script');
		script.src = src;
		script.async = true;

		const promise = new Promise((resolve, reject) => {
			script.addEventListener('load', () => {
				resolve();
			});

			script.addEventListener('error', () => {
				reject();
			});
		});

		document.body.append(script);

		this.scripts.set(src, script);

		return promise;
	}
	get destination() {
		const { hash } = global.location;

		if (hash === '') {
			throw new Error('No hash was provided');
		}

		return new URL(hash.slice(1));
	}
	redirect(url) {
		global.location.replace(url);
	}
	async _componentDidMount() {}
	async componentDidMount() {
		try {
			await this._componentDidMount();
		} catch (error) {
			console.error(error);
			this.setState({
				error: error.stack,
			});
		}
	}
	async componentWillUnmount() {
		for (let [src, script] of this.scripts) {
			script.remove();
			this.scripts.delete(src);
		}
	}
	async possible_error(message) {
		// errors must be VERY verbose for the user
		this.setState({
			possible_error: message,
		});
	}
	render() {
		set_page('proxy-script');

		let main;

		if (this.state.error === undefined) {
			main = (
				<main>
					<p>{obfuscate(<>{this.name}</>)} is loading...</p>
				</main>
			);
		} else {
			let description;

			if (this.state.possible_error === undefined) {
				description = <pre>{this.state.error}</pre>;
			} else {
				description = <p>{this.state.possible_error}</p>;
			}

			main = (
				<main>
					<p>An error when loading {obfuscate(<>{this.name}</>)}:</p>
					{description}
				</main>
			);
		}

		return <>{main}</>;
	}
}
