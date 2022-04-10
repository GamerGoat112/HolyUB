import { Component } from 'react';
import obfuscate from '../obfuscate.js';
import { set_page } from '../root.js';

export default class Contact extends Component {
	render() {
		set_page('contact');

		return (
			<main>
				<h1>Contact:</h1>
				<p>
					GitHub:{' '}
					<a href="https://git.holy.how/holy">
						{obfuscate(<>https://git.holy.how/holy</>)}
					</a>
				</p>
				<p>
					Email:{' '}
					<a href="mailto:support@holy.how">
						{obfuscate(<>support@holy.how</>)}
					</a>
				</p>
				<p>
					{obfuscate(<>Discord</>)}:{' '}
					<a href="https://discord.gg/QKMwvd6tx6">
						{obfuscate(<>https://discord.gg/QKMwvd6tx6</>)}
					</a>
				</p>
			</main>
		);
	}
}
