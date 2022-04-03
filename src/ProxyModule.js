import { Component } from 'react';
import obfuscate from './obfuscate.js';
import root from './root.js';

export default class ProxyModule extends Component {
	state = {};
	get destination() {
		const { hash } = global.location;

		if (hash === '') {
			throw new Error('No hash was provided');
		}

		return new URL(hash.slice(1));
	}
	redirect(url) {
		global.location.assign(url);
	}
	async componentDidMount() {
		try {
			await this._componentDidMount();
		} catch (error) {
			this.setState({
				error,
			});
		}
	}
	async possible_error(message) {
		// errors must be VERY verbose for the user
		this.setState({
			possible_error: message,
		});
	}
	render() {
		root.dataset.page = 'proxy-script';

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
				description = this.state.error.toString();
			} else {
				description = this.state.possible_error;
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
