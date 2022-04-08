import { Component } from 'react';
import obfuscate from '../obfuscate.js';
import root from '../root.js';

export default class Contact extends Component {
	render() {
		root.dataset.page = 'contact';

		return (
			<main>
				<h1>Contact:</h1>
				<p>
					GitHub:
					<a href="https://github.com/sysce">
						{obfuscate(<>https://github.com/sysce</>)}
					</a>
				</p>
				<p>
					Email:
					<a href="mailto:support@sys32.dev">
						{obfuscate(<>support@sys32.dev</>)}
					</a>
				</p>
				<p>
					{obfuscate(<>Discord</>)}:
					<a href="https://discord.gg/rXFjfYt3ae">
						{obfuscate(<>https://discord.gg/rXFjfYt3ae</>)}
					</a>
				</p>
			</main>
		);
	}
}
