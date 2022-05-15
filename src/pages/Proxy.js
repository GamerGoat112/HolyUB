import { Obfuscated, ObfuscatedA } from '../obfuscate.js';
import { PATREON_URL, TN_DISCORD_URL } from '../root.js';
import { createRef, useEffect, useRef, useState } from 'react';
import { NorthWest, Search } from '@mui/icons-material';
import Footer from '../Footer.js';
import ServiceFrame from '../ServiceFrame.js';
import textContent from '../textContent.js';
import engines from '../engines.js';
import clsx from 'clsx';
import '../styles/Proxy.scss';
import { ThemeInputBar } from '../ThemeElements.js';
import useRefDefault from '../useRefDefault.js';

export default function Proxies(props) {
	const service_frame = useRef();
	const input = useRef();
	const form = useRef();
	const suggested = useRef();
	const input_value = useRef();
	const last_input = useRef();
	const [last_select, set_last_select] = useState(-1);
	const [omnibox_entries, set_omnibox_entries] = useState([]);
	const [input_focused, set_input_focused] = useState(false);

	async function on_input() {
		if (input_value.current !== input.current.value) {
			input_value.current = input.current.value;

			set_omnibox_entries(
				await service_frame.current.omnibox_entries(input.current.value)
			);
		}
	}

	function search_submit() {
		let value;

		if (last_select === -1 || last_input.current === 'input') {
			value = input.current.value;
		} else {
			value = textContent(omnibox_entries[last_select]);
			input.current.value = value;
		}

		set_input_focused(false);
		service_frame.current.proxy(input.current.value);
		on_input();
	}

	useEffect(() => {
		on_input();
	});

	const render_suggested = input_focused && omnibox_entries.length !== 0;
	const suggested_list = [];

	if (render_suggested) {
		for (let i = 0; i < omnibox_entries.length; i++) {
			const text = createRef();

			suggested_list.push(
				<div
					key={i}
					tabIndex={0}
					className={clsx('option', i === last_select && 'hover')}
					onClick={() => {
						last_input.current = 'select';
						input.current.value = text.current.textContent;
						search_submit();
					}}
					onMouseOver={() => {
						set_last_select(i);
					}}
				>
					<Search className="search" />
					<span
						className="text"
						ref={text}
						dangerouslySetInnerHTML={{
							__html: omnibox_entries[i],
						}}
					/>
					<NorthWest className="open" />
				</div>
			);
		}
	}

	let engine;
	const format = useRefDefault(() =>
		props.layout.current.settings.get('search')
	);

	for (let _engine of engines) {
		if (_engine.format === format.current) {
			engine = _engine;
			break;
		}
	}

	if (engine === undefined) {
		engine = engines[0];
	}

	return (
		<>
			<main className="proxy">
				<ServiceFrame layout={props.layout} ref={service_frame} />
				<form
					className="omnibox"
					data-suggested={Number(render_suggested)}
					data-focused={Number(input_focused)}
					onSubmit={event => {
						event.preventDefault();
						search_submit();
					}}
					onBlur={event => {
						if (!form.current.contains(event.relatedTarget)) {
							set_input_focused(false);
						}
					}}
					ref={form}
				>
					<ThemeInputBar>
						<Search className="icon" />
						<input
							type="text"
							placeholder={`Search ${engine.name} or type a URL`}
							required={last_select === -1}
							autoComplete="off"
							className="thin-pad-left"
							list="proxy-omnibox"
							ref={input}
							onInput={on_input}
							onFocus={() => {
								on_input();
								set_input_focused(true);
								set_last_select(-1);
							}}
							onClick={() => {
								on_input();
								set_input_focused(true);
								set_last_select(-1);
							}}
							onChange={() => {
								last_input.current = 'input';
								set_last_select(-1);
							}}
							onKeyDown={event => {
								let prevent_default = true;

								switch (event.code) {
									case 'Escape':
										this.setState({
											input_focused: false,
										});
										break;
									case 'ArrowDown':
									case 'ArrowUp':
										{
											let last_i = last_select;

											let next;

											switch (event.code) {
												case 'ArrowDown':
													if (last_i >= omnibox_entries.length - 1) {
														next = 0;
													} else {
														next = last_i + 1;
													}
													break;
												case 'ArrowUp':
													if (last_i <= 0) {
														next = omnibox_entries.length - 1;
													} else {
														next = last_i - 1;
													}
													break;
												case 'Enter':
													search_submit();
													break;
												// no default
											}

											last_input.current = 'select';

											set_last_select(next);
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
					</ThemeInputBar>
					<div
						ref={suggested}
						className="suggested"
						onMouseLeave={() => {
							this.setState({
								last_select: -1,
							});
						}}
					>
						{suggested_list}
					</div>
				</form>
				<p>
					<Obfuscated>
						This is a free service paid for by our Patreons. If you want faster
						servers, donate to Holy Unblocker on{' '}
					</Obfuscated>
					<ObfuscatedA className="theme-link" href={PATREON_URL}>
						<Obfuscated>Patreon</Obfuscated>
					</ObfuscatedA>
					.
				</p>
				<p>
					<Obfuscated>Click </Obfuscated>
					<ObfuscatedA className="theme-link" href={TN_DISCORD_URL}>
						here
					</ObfuscatedA>
					<Obfuscated>
						{' '}
						to join the TN Discord for access to new Holy Unblocker links.
					</Obfuscated>
				</p>
			</main>
			<Footer />
		</>
	);
}
