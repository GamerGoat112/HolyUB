import { Component } from 'react';
import obfuscate from '../obfuscate.js';
import { set_page } from '../root.js';

export default class Home extends Component {
	render() {
		set_page('home');

		return (
			<>
				<main>
					<h1>{obfuscate(<>End Internet Censorship.</>)}</h1>
					<h2>{obfuscate(<>Privacy right at your fingertips.</>)}</h2>
				</main>
			</>
		);
	}
}
