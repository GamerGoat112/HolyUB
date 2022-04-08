import obfuscate from '../obfuscate.js';
import root from '../root.js';
import { Component } from 'react';

export default class Home extends Component {
	render() {
		root.dataset.page = 'home';

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
