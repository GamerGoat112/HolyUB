import obfuscate from '../obfuscate.js';
import { set_page } from '../root.js';
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
					<div className="toggle material-icons">
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
	state = {
		omnibox_entries: [],
	};
	get layout() {
		return this.props.layout.current;
	}
	get service_frame() {
		return this.layout.service_frame.current;
	}
	async componentDidMount() {
		await {};
		this.on_input();
	}
	async on_input() {
		this.setState({
			omnibox_entries: await this.service_frame.omnibox_entries(
				this.input.current.value
			),
		});
	}
	search_submit(event) {
		event.preventDefault();
		this.service_frame.proxy(this.input.current.value);
		this.input.current.value = '';
		this.on_input();
	}
	render() {
		set_page('proxy');

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
						<label>
							{obfuscate(<>Proxy</>)}:
							<select
								onChange={event =>
									this.service_frame.settings.set('proxy', event.target.value)
								}
								defaultValue={this.service_frame.settings.get('proxy')}
							>
								<option value="auto">Automatic (Default)</option>
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
