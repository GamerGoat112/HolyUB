import obfuscate from '../obfuscate.js';
import root from '../root.js';
import { Component, createRef } from 'react';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';

export default class Proxies extends Component {
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
		root.dataset.page = 'proxy';

		return (
			<>
				<main>
					<form className="omnibox" onSubmit={this.search_submit.bind(this)}>
						<input
							type="text"
							placeholder="Search Google or type a URL"
							required
							autoComplete="off"
							list="proxy-omnibox"
							ref={this.input}
							onInput={this.on_input.bind(this)}
						/>
						<datalist id="proxy-omnibox">{this.state.omnibox_entries}</datalist>
						<button type="submit">
							<SearchSVG />
						</button>
					</form>
				</main>
			</>
		);
	}
}
