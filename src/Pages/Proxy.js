import obfuscate from '../obfuscate.js';
import root from '../root.js';
import { Component, createRef } from 'react';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';

class Expand extends Component {
	state = {
		expanded: false,
	};
	render() {
		return (
			<div className="expand" data-expanded={Number(this.state.expanded)}>
				<div
					className="title"
					onClick={() => this.setState({ expanded: !this.state.expanded })}
				>
					<span>{this.props.title}</span>
					<div class="toggle material-icons">
						{this.state.expanded ? 'expand_less' : 'expand_more'}
					</div>
				</div>
				<div className="content">{this.props.children}</div>
			</div>
		);
	}
}

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

					<Expand title="Advanced Options">
						<h3>{obfuscate(<>Manual Proxy</>)}</h3>
						<label>
							<input type="checkbox" name="Enabled"></input>
							Enabled?
						</label>
						<br />
						<label>
							Proxy:
							<select>
								<option value="uv">Ultraviolet</option>
								<option value="rh">Rammerhead</option>
								<option value="st">Stomp</option>
							</select>
						</label>
					</Expand>
				</main>
			</>
		);
	}
}
