import { Component } from 'react';
import { Obfuscated, ObfuscatedA } from '../obfuscate.js';
import { set_page } from '../root.js';

export default class Credits extends Component {
	render() {
		set_page('credits');

		return (
			<main>
				<h2>Credits</h2>

				<ul></ul>

				<h2>Open-source licenses</h2>

				<ul>
					<li>
						<Obfuscated>Rammerhead:</Obfuscated>{' '}
						<ObfuscatedA href="https://github.com/binary-person/rammerhead">
							<Obfuscated>
								https://github.com/binary-person/rammerhead
							</Obfuscated>
						</ObfuscatedA>
					</li>
					<li>
						<Obfuscated>Ultraviolet:</Obfuscated>{' '}
						<ObfuscatedA href="https://github.com/titaniumnetwork-dev/Ultraviolet">
							<Obfuscated>
								https://github.com/titaniumnetwork-dev/Ultraviolet
							</Obfuscated>
						</ObfuscatedA>
					</li>
					<li>
						<Obfuscated>Stomp:</Obfuscated>{' '}
						<ObfuscatedA href="https://github.com/sysce/stomp">
							<Obfuscated>https://github.com/sysce/stomp</Obfuscated>
						</ObfuscatedA>
					</li>
				</ul>
			</main>
		);
	}
}
