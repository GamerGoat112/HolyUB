import { Obfuscated, ObfuscatedA } from '../obfuscate.js';
import { set_page } from '../root.js';
import { Component, createRef } from 'react';
import ServiceFrame from '../ServiceFrame.js';
import '../styles/Proxy.scss';
import PlainSelect from '../PlainSelect.js';
import textContent from '../textContent.js';

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
	service_frame = createRef();
	input = createRef();
	form = createRef();
	suggested = createRef();
	state = {
		omnibox_entries: [],
		input_focused: false,
	};
	/**
	 * @returns {import('react').RefObject<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	async componentDidMount() {
		this.on_input();
	}
	async on_input() {
		if (this.state.input_value !== this.input.current.value) {
			this.setState({
				input_value: this.input.current.value,
				omnibox_entries: await this.service_frame.current.omnibox_entries(
					this.input.current.value
				),
			});
		}
	}
	search_submit() {
		let value;

		if (this.state.last_select === -1) {
			value = this.input.current.value;
		} else {
			value = textContent(this.state.omnibox_entries[this.state.last_select]);
			this.input.current.value = value;
		}

		this.setState({ input_focused: false });
		this.service_frame.current.proxy(this.input.current.value);
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
				const classes = ['option'];

				if (i === this.state.last_select) {
					classes.push('hover');
				}

				suggested.push(
					<div
						key={i}
						tabIndex="0"
						className={classes.join(' ')}
						onClick={() => {
							this.input.current.value = text.current.textContent;
							this.search_submit();
						}}
						onMouseOver={() => {
							this.setState({
								last_select: i,
							});
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
				<ServiceFrame layout={this.layout} ref={this.service_frame} />
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
							required={this.state.last_select === -1}
							autoComplete="off"
							list="proxy-omnibox"
							ref={this.input}
							onInput={this.on_input.bind(this)}
							onFocus={() => {
								this.on_input();
								this.setState({ input_focused: true, last_select: -1 });
							}}
							onKeyDown={event => {
								let prevent_default = true;

								switch (event.code) {
									case 'ArrowDown':
									case 'ArrowUp':
										// eslint-disable-next-line no-lone-blocks
										{
											let last_i = this.state.last_select;

											let next;

											switch (event.code) {
												case 'ArrowDown':
													if (last_i >= this.state.omnibox_entries.length - 1) {
														next = 0;
													} else {
														next = last_i + 1;
													}
													break;
												case 'ArrowUp':
													if (last_i <= 0) {
														next = this.state.omnibox_entries.length - 1;
													} else {
														next = last_i - 1;
													}
													break;
												case 'Enter':
													this.search_submit();
													break;
												// no default
											}

											this.setState({
												last_select: next,
											});
										}
										break;
									default:
										prevent_default = false;
										break;
									// no default
								}

								if (prevent_default) {
									event.preventDefault();
								}
							}}
						/>
						<span className="eyeglass material-icons">search</span>
						<div
							ref={this.suggested}
							className="suggested"
							onMouseLeave={() => {
								this.setState({
									last_select: -1,
								});
							}}
						>
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
							<PlainSelect
								onChange={event =>
									this.layout.current.settings.set('proxy', event.target.value)
								}
								defaultValue={this.layout.current.settings.get('proxy')}
							>
								<option value="auto">Automatic (Default)</option>
								<option value="uv">Ultraviolet</option>
								<option value="rh">Rammerhead</option>
								<option value="st">Stomp</option>
							</PlainSelect>
						</label>
					</Expand>
				</main>
			</>
		);
	}
}
