import { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout.js';
import { Obfuscated } from './obfuscate.js';
import { set_page } from './root.js';

export default class ProxyLayout extends Component {
	layout = new Layout();
	container = createRef();
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

		//if (this.state.error === undefined) {
		main = (
			<main ref={this.container}>
				<p>
					<Obfuscated>{this.name}</Obfuscated> is loading...
				</p>
			</main>
		);
		/*} else {
			let description;

			if (this.state.possible_error === undefined) {
				description = <pre>{this.state.error}</pre>;
			} else {
				description = <pre>{this.state.possible_error}</pre>;
			}

			main = (
				<main ref={this.container}>
					<span>
						An error when loading <Obfuscated>{this.name}</Obfuscated>:
						<br />
						{description}
					</span>
					<p>
						Try again by clicking{' '}
						<a
							href="i:"
							onClick={event => {
								event.preventDefault();
								global.location.reload();
							}}
						>
							here
						</a>
						.
					</p>
					<p>
						If this problem still occurs, check{' '}
						<Link to="/support.html" target="_parent">
							Support
						</Link>{' '}
						or{' '}
						<Link to="/contact.html" target="_parent">
							Contact Us
						</Link>
						.
					</p>
				</main>
			);
		}*/

		return main;
	}
}
