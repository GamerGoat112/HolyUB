import Layout from './Layout.js';
import { Obfuscated, ObfuscateLayout } from './obfuscate.js';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { forwardRef } from 'react';
import resolveRoute from './resolveRoute.js';
import './styles/Compat.scss';

class CompatLayout extends Layout {
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
	report(error, error_cause, origin) {
		console.error(error);

		this.setState({
			error,
			error_cause,
			origin,
		});
	}
	async componentWillUnmount() {
		for (let [src, script] of this.scripts) {
			script.remove();
			this.scripts.delete(src);
		}
	}
	get destination() {
		if (this.props.location.hash === '') {
			throw new Error('No hash was provided');
		}

		return new URL(this.props.location.hash.slice(1));
	}
	render() {
		return (
			<>
				{super.render()}
				<ObfuscateLayout />
				{this.state.error ? (
					<main className="error">
						{' '}
						<span>
							An error occured when loading{' '}
							<Obfuscated>{this.state.origin}</Obfuscated>:
							<br />
							<pre>{this.state.error_cause || this.state.error.toString()}</pre>
						</span>
						<p>
							Try again by clicking{' '}
							<a
								className="theme-link"
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
							<Link
								className="theme-link"
								to={resolveRoute('/', 'faq')}
								target="_parent"
							>
								FAQ
							</Link>{' '}
							or{' '}
							<Link
								className="theme-link"
								to={resolveRoute('/', 'contact')}
								target="_parent"
							>
								Contact Us
							</Link>
							.
						</p>
					</main>
				) : (
					<Outlet />
				)}
			</>
		);
	}
}

export default forwardRef((props, ref) => {
	const { children, ...attributes } = props;

	return (
		<CompatLayout ref={ref} location={useLocation()} {...attributes}>
			{children}
		</CompatLayout>
	);
});
