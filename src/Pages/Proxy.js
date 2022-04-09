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
					<div className="toggle material-icons">
						{this.state.expanded ? 'expand_less' : 'expand_more'}
					</div>
				</div>
				<div className="content">{this.props.children}</div>
			</div>
		);
	}
}

const default_settings = {
	manual_enabled: false,
	manual_target: 'uv',
};

export default class Proxies extends Component {
	input = createRef();
	storage_key = 'proxy';
	state = {
		settings: this.get_settings(),
		omnibox_entries: [],
	};
	async componentDidMount() {
		await {};
		this.on_input();
		this.get_settings();
	}
	get_settings() {
		if (localStorage[this.storage_key] === undefined) {
			localStorage[this.storage_key] = '{}';
		}

		let parsed;

		try {
			parsed = JSON.parse(localStorage[this.storage_key]);
		} catch (error) {
			parsed = {};
		}

		const settings = {};
		let update = false;

		for (let key in default_settings) {
			if (typeof parsed[key] === typeof default_settings[key]) {
				settings[key] = parsed[key];
			} else {
				update = true;
			}
		}

		if (update) {
			localStorage[this.storage_key] = JSON.stringify(this.state.settings);
		}

		return settings;
	}
	async set_settings(settings = {}) {
		await this.setState({
			settings: {
				...this.state.settings,
				...settings,
			},
		});

		localStorage[this.storage_key] = JSON.stringify(this.state.settings);
	}
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
							Enabled?
							<input
								type="checkbox"
								name="Enabled"
								onChange={event =>
									this.set_settings({ manual_enabled: event.target.checked })
								}
								checked={this.state.settings.manual_enabled}
							></input>
						</label>
						<label>
							Proxy:
							<select
								onChange={event =>
									this.set_settings({ manual_target: event.target.value })
								}
								value={this.state.settings.manual_target}
							>
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
