import BareClient from 'bare-client';
import { useRef } from 'react';
import { Notification } from '../../Notifications.js';
import { Obfuscated } from '../../obfuscate.js';
import { BARE_API } from '../../root.js';
import { Check } from '@mui/icons-material';
import { ThemeButton, ThemeInputBar } from '../../ThemeElements.js';

const bare = new BareClient(BARE_API);

async function extract_data(url) {
	const response = await bare.fetch(url, {
		redirect: 'follow',
	});

	if (!response.ok) {
		throw new Error(`Response was not OK. Got ${response.status}`);
	}

	const parser = new DOMParser();

	const dom = parser.parseFromString(`${await response.text()}`, 'text/html');

	const base = document.createElement('base');
	base.href = url;

	dom.head.append(base);

	let icon;
	let title;

	{
		const selector = dom.querySelector('link[rel*="icon"]');

		if (selector !== null && selector.href !== '') {
			icon = selector.href;
		} else {
			icon = new URL('/favicon.ico', url).toString();
		}
	}

	icon = await blobToDataURL(
		await (await bare.fetch(icon, { redirect: 'follow' })).blob()
	);

	{
		const selector = dom.querySelector('title');

		if (selector !== null && selector.textContent !== '') {
			title = selector.textContent;
		} else {
			const url = response.finalURL;
			title = `${url.host}${url.pathname}${url.search}${url.query}`;
		}
	}

	return { icon, title, url: response.finalURL };
}

const whitespace = /\s+/;
const protocol = /^\w+:/;

function resolve_url(input) {
	if (input.match(protocol)) {
		return input;
	} else if (input.includes('.') && !input.match(whitespace)) {
		return `http://${input}`;
	} else {
		throw new Error('Bad URL');
	}
}

/**
 *
 * @param {string} url
 * @returns {{title:string,icon:string,url:string}}
 */
async function cloak_url(url) {
	switch (url) {
		case 'about:blank':
			return {
				title: 'about:blank',
				icon: 'none',
				url: 'about:blank',
			};
		default:
			return await extract_data(url);
	}
}

async function blobToDataURL(blob) {
	const reader = new FileReader();

	return new Promise((resolve, reject) => {
		reader.addEventListener('load', () => resolve(reader.result));
		reader.addEventListener('error', reject);
		reader.readAsDataURL(blob);
	});
}

export default function TabCloak(props) {
	const input = useRef();

	async function onSubmit() {
		try {
			props.layout.current.notifications.current.add(
				<Notification description="Fetching..." type="info" />
			);

			const { title, icon, url } = await cloak_url(
				resolve_url(input.current.value)
			);

			input.current.value = url;

			props.layout.current.set_cloak({
				title,
				icon,
				url,
			});

			props.layout.current.notifications.current.add(
				<Notification description="Cloak set" type="success" />
			);
		} catch (error) {
			props.layout.current.notifications.current.add(
				<Notification description={error.message} type="error" />
			);
		}
	}

	return (
		<section>
			<div>
				<Obfuscated>
					Tab Cloaking allows you to disguise Holy Unblocker as any website such
					as your school's home page, new tab, etc.
				</Obfuscated>
			</div>
			<div>
				<span>
					<Obfuscated>URL</Obfuscated>:
				</span>
				<form
					onSubmit={event => {
						event.preventDefault();
						onSubmit();
					}}
				>
					<ThemeInputBar>
						<input
							className="thin-pad-right"
							defaultValue={props.layout.current.cloak.url}
							placeholder="https://example.org/"
							ref={input}
						/>
						<Check onClick={onSubmit} className="button right" />
					</ThemeInputBar>
				</form>
			</div>
			<div>
				<ThemeButton
					onClick={() => {
						props.layout.current.set_cloak({
							title: '',
							icon: '',
							url: '',
						});

						input.current.value = '';

						props.layout.current.notifications.current.add(
							<Notification description="Cloak reset" type="info" />
						);
					}}
				>
					<Obfuscated>Reset Cloak</Obfuscated>
				</ThemeButton>
			</div>
		</section>
	);
}
