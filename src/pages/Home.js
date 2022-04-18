import { Component } from 'react';
import { Obfuscated } from '../obfuscate.js';
import { set_page } from '../root.js';
import '../styles/Home.scss';

export default class Home extends Component {
	render() {
		set_page('home');

		return (
			<>
				<main>
					<div className="landing">
						<h1>
							<Obfuscated>End Internet Censorship.</Obfuscated>
						</h1>
						<h2>
							<Obfuscated>Privacy right at your fingertips.</Obfuscated>
						</h2>
					</div>
				</main>
			</>
		);
	}
}
