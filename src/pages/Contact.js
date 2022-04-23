import { Component } from 'react';
import { Obfuscated, ObfuscatedA } from '../obfuscate.js';
import { set_page } from '../root.js';

export default class Contact extends Component {
	render() {
		set_page('contact');

		return (
			<main>
				<h1>Contact:</h1>
				<ul>
					<li>
						GitHub:{' '}
						<ObfuscatedA href="https://git.holy.how/holy">
							<Obfuscated>https://git.holy.how/holy</Obfuscated>
						</ObfuscatedA>
					</li>
					<li>
						Email:{' '}
						<ObfuscatedA href="mailto:support@holy.how">
							<Obfuscated>support@holy.how</Obfuscated>
						</ObfuscatedA>
					</li>
					<li>
						<Obfuscated>Discord</Obfuscated>:{' '}
						<ObfuscatedA href="https://discord.gg/QKMwvd6tx6">
							<Obfuscated>https://discord.gg/QKMwvd6tx6</Obfuscated>
						</ObfuscatedA>
					</li>
				</ul>
			</main>
		);
	}
}
