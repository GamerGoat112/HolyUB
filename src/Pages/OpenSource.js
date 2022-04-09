import { Component } from 'react';
import obfuscate from '../obfuscate.js';
import root from '../root.js';

export default class OpenSource extends Component {
	render() {
		root.dataset.page = 'opensource';

		return (
			<main>
				<h1>Open-source credits</h1>

				<ul>
					<li>
						{obfuscate(<>Rammerhead:</>)}{' '}
						<a href="https://github.com/binary-person/rammerhead">
							{obfuscate(<>https://github.com/binary-person/rammerhead</>)}
						</a>
					</li>
					<li>
						{obfuscate(<>Ultraviolet:</>)}{' '}
						<a href="https://github.com/titaniumnetwork-dev/Ultraviolet">
							{obfuscate(
								<>https://github.com/titaniumnetwork-dev/Ultraviolet</>
							)}
						</a>
					</li>
					<li>
						{obfuscate(<>Stomp:</>)}{' '}
						<a href="https://github.com/sysce/stomp">
							{obfuscate(<>https://github.com/sysce/stomp</>)}
						</a>
					</li>
				</ul>
			</main>
		);
	}
}
