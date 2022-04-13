import obfuscate from '../obfuscate.js';
import { set_page } from '../root.js';
import { Component, createRef } from 'react';

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
	form = createRef();
	state = {
		omnibox_entries: [],
		input_focused: false,
	};
	/**
	 * @returns {import('../Layout.js').default}
	 */
	get layout() {
		return this.props.layout.current;
	}
	/**
	 * @returns {import('../ServiceFrame.js').default}
	 */
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
	search_submit() {
		this.setState({ input_focused: false });
		this.service_frame.proxy(this.input.current.value);
		this.on_input();
	}
	render() {
		set_page('proxy');

		const render_suggested = this.state.omnibox_entries.length !== 0;
		const suggested = [];

		if (render_suggested) {
			for (let i = 0; i < this.state.omnibox_entries.length; i++) {
				suggested.push(
					<div
						key={i}
						onClick={() => {
							this.input.current.value = this.state.omnibox_entries[i];
							this.search_submit();
						}}
					>
						<span className="eyeglass material-icons">search</span>
						<span className="text">{this.state.omnibox_entries[i]}</span>
						<span className="open material-icons">north_west</span>
					</div>
				);
			}
		}

		return (
			<>
				<main>
					<form
						className="omnibox"
						data-suggested={Number(
							this.state.input_focused && render_suggested
						)}
						data-focused={Number(this.state.input_focused)}
						onBlur={event => {
							if (!this.form.current.contains(event.target)) {
								this.setState({ input_focused: false });
							}
						}}
						onSubmit={event => {
							event.preventDefault();
							this.search_submit();
						}}
						ref={this.form}
					>
						<input
							type="text"
							placeholder="Search Google or type a URL"
							required
							autoComplete="off"
							list="proxy-omnibox"
							ref={this.input}
							onInput={this.on_input.bind(this)}
							onFocus={() => this.setState({ input_focused: true })}
							onBlur={() => this.setState({ input_focused: false })}
						/>
						<span className="eyeglass material-icons">search</span>
						<div className="suggested">{suggested}</div>
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
