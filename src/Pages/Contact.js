import { Component } from 'react';
import obfuscate, { ObfuscatedA } from '../obfuscate.js';
import { set_page } from '../root.js';

export default class Contact extends Component {
	render() {
		set_page('contact');

		return (
			<main>
				<h1>Contact:</h1>
				<p>
					GitHub:{' '}
					<ObfuscatedA href="https://git.holy.how/holy">
						{obfuscate(<>https://git.holy.how/holy</>)}
					</ObfuscatedA>
				</p>
				<p>
					Email:{' '}
					<ObfuscatedA href="mailto:support@holy.how">
						{obfuscate(<>support@holy.how</>)}
					</ObfuscatedA>
				</p>
				<p>
					{obfuscate(<>Discord</>)}:{' '}
					<ObfuscatedA href="https://discord.gg/QKMwvd6tx6">
						{obfuscate(<>https://discord.gg/QKMwvd6tx6</>)}
					</ObfuscatedA>
				</p>
			</main>
		);
	}
}
