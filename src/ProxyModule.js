import { Component } from 'react';
import obfuscate from './obfuscate.js';
import { set_page } from './root.js';

export default class ProxyModule extends Component {
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
	state = {};
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

		if (this.state.error === undefined) {
			return (
				<>
					<main>
						<p>Your {obfuscate(<>proxy</>)} is loading...</p>
					</main>
				</>
			);
		} else {
			let description;

			if (this.state.possible_error === undefined) {
				description = <pre>{this.state.error}</pre>;
			} else {
				description = <p>{this.state.possible_error}</p>;
			}

			return (
				<main>
					<p>
						We encountered an error while loading your {obfuscate(<>proxy</>)}:
					</p>
					{description}
				</main>
			);
		}
	}
}
