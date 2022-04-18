import { Obfuscated, ObfuscatedA } from '../obfuscate.js';
import { set_page } from '../root.js';
import { Component, createRef } from 'react';
import '../styles/Proxy.scss';

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
	suggested = createRef();
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
		if (this.state.input_value !== this.input.current.value) {
			this.setState({
				input_value: this.input.current.value,
				omnibox_entries: await this.service_frame.omnibox_entries(
					this.input.current.value
				),
			});
		}
	}
	search_submit() {
		this.setState({ input_focused: false });
		this.service_frame.proxy(this.input.current.value);
		this.on_input();
	}
	render() {
		set_page('proxy');

		const render_suggested =
			this.state.input_focused && this.state.omnibox_entries.length !== 0;
		const suggested = [];

		if (render_suggested) {
			for (let i = 0; i < this.state.omnibox_entries.length; i++) {
				const text = createRef();

				suggested.push(
					<div
						key={i}
						tabIndex="0"
						onClick={() => {
							this.input.current.value = text.current.textContent;
							this.search_submit();
						}}
					>
						<span className="eyeglass material-icons">search</span>
						<span
							className="text"
							ref={text}
							dangerouslySetInnerHTML={{
								__html: this.state.omnibox_entries[i],
							}}
						/>
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
						data-suggested={Number(render_suggested)}
						data-focused={Number(this.state.input_focused)}
						onSubmit={event => {
							event.preventDefault();
							this.search_submit();
						}}
						onBlur={async event => {
							await {};
							if (!this.form.current.contains(event.relatedTarget)) {
								this.setState({ input_focused: false });
							}
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
							onFocus={() => {
								this.on_input();
								this.setState({ input_focused: true });
							}}
						/>
						<span className="eyeglass material-icons">search</span>
						<div ref={this.suggested} className="suggested">
							{suggested}
						</div>
					</form>
					<p>
						<Obfuscated>
							This is a free service paid for by our Patreons. If you want
							faster servers, donate to Holy Unblocker on{' '}
						</Obfuscated>
						<ObfuscatedA href="https://www.patreon.com/holyunblocker">
							<Obfuscated>Patreon</Obfuscated>
						</ObfuscatedA>
						.
					</p>
					<p>
						<Obfuscated>Click </Obfuscated>
						<ObfuscatedA href="https://discord.gg/unblock">here</ObfuscatedA>
						<Obfuscated>
							{' '}
							to join our Discord for access to new Holy Unblocker links.
						</Obfuscated>
					</p>
					<Expand title="Advanced Options">
						<label>
							<Obfuscated>Proxy</Obfuscated>:
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
