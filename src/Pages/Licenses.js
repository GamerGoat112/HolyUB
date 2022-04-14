import { Component } from 'react';
import obfuscate, { ObfuscatedA } from '../obfuscate.js';
import { set_page } from '../root.js';

export default class Licenses extends Component {
	render() {
		set_page('licenses');

		return (
			<main>
				<h2>Licenses and open-source credits.</h2>

				<ul>
					<li>
						{obfuscate(<>Rammerhead:</>)}{' '}
						<ObfuscatedA href="https://github.com/binary-person/rammerhead">
							{obfuscate(<>https://github.com/binary-person/rammerhead</>)}
						</ObfuscatedA>
					</li>
					<li>
						{obfuscate(<>Ultraviolet:</>)}{' '}
						<ObfuscatedA href="https://github.com/titaniumnetwork-dev/Ultraviolet">
							{obfuscate(
								<>https://github.com/titaniumnetwork-dev/Ultraviolet</>
							)}
						</ObfuscatedA>
					</li>
					<li>
						{obfuscate(<>Stomp:</>)}{' '}
						<ObfuscatedA href="https://github.com/sysce/stomp">
							{obfuscate(<>https://github.com/sysce/stomp</>)}
						</ObfuscatedA>
					</li>
				</ul>
			</main>
		);
	}
}
