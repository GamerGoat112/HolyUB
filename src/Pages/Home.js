import TypeWriter from '../TypeWriter.js';
import obfuscate from '../obfuscate.js';
import root from '../root.js';
import { Component, createRef } from 'react';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';
import { Link } from 'react-router-dom';

export default class Home extends Component {
	input = createRef();
	async componentDidMount() {
		await {};
		this.on_input();
	}
	state = {
		omnibox_entries: [],
	};
	async on_input() {
		this.setState({
			omnibox_entries:
				await this.props.layout.current.service_frame.current.omnibox_entries(
					this.input.current.value
				),
		});
	}
	search_submit(event) {
		event.preventDefault();
		this.props.layout.current.service_frame.current.proxy(
			this.input.current.value
		);
		this.input.current.value = '';
		this.on_input();
	}
	render() {
		root.dataset.page = 'home';

		return (
			<>
				<main>
					<h1 className="title">
						Your internet
						<br />
						<TypeWriter
							element={<h1 className="adjective">placeholder</h1>}
							speed={50}
							delay={5000}
							strings={[
								'More Secure.',
								'More Private.',
								'Uncensored.',
								'Safer.',
								'Easier',
								'More Fun.',
							]}
						></TypeWriter>
						<br />
					</h1>
					<div className="description">
						{obfuscate(<>SystemYA</>)} is a service that allows you to
						circumvent firewalls on locked down machines through in-page{' '}
						{obfuscate(<>web proxies</>)}.
					</div>
					<form className="omnibox" onSubmit={this.search_submit.bind(this)}>
						<input
							type="text"
							placeholder="Search Google or type a URL"
							required
							autoComplete="off"
							list="home-omnibox"
							ref={this.input}
							onInput={this.on_input.bind(this)}
						/>
						<datalist id="home-omnibox">{this.state.omnibox_entries}</datalist>
						<button type="submit">
							<SearchSVG />
						</button>
					</form>
				</main>
			</>
		);
	}
}
