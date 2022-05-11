import { Component, createRef, forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Obfuscated } from './obfuscate.js';
import { resolveRoute } from './Routes.js';
import './styles/Compat.scss';

export default class CompatModule extends Component {
	container = createRef();
	state = {
		error: undefined,
		possible_error: undefined,
	};
	/**
	 * @returns {import('react').RefObject<import('./CompatLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
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
		if (this.props.location.hash === '') {
			throw new Error('No hash was provided');
		}

		return new URL(this.props.location.hash.slice(1));
	}
	redirect(url) {
		global.location.assign(url);
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
		this.layout.current.set_page('compat');

		if (this.state.error !== undefined) {
			let description;

			if (this.state.possible_error === undefined) {
				description = <pre>{this.state.error}</pre>;
			} else {
				description = <pre>{this.state.possible_error}</pre>;
			}

			return (
				<main ref={this.container}>
					<span>
						An error occured when loading <Obfuscated>{this.name}</Obfuscated>:
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
						<br />
						If this problem still occurs, check our{' '}
						<Link to={resolveRoute('/', 'faq')} target="_parent">
							FAQ
						</Link>{' '}
						or{' '}
						<Link to={resolveRoute('/', 'contact')} target="_parent">
							Contact Us
						</Link>
						.
					</p>
				</main>
			);
		}

		return (
			<main ref={this.container}>
				<p>
					<Obfuscated>{this.name}</Obfuscated> is loading...
				</p>
			</main>
		);
	}
}

export function wrapCompat(Element) {
	return forwardRef((props, ref) => {
		return <Element {...props} ref={ref} location={useLocation()} />;
	});
}
