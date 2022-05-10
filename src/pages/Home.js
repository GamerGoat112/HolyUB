import { Component } from 'react';
import { Obfuscated } from '../obfuscate.js';
import { set_page } from '../root.js';
import '../styles/Home.scss';

export default class Home extends Component {
	/**
	 * @returns {import('react').RefObject<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	render() {
		set_page('home');

		return (
			<main>
				<h1>
					<Obfuscated>End Internet Censorship.</Obfuscated>
				</h1>
				<h2>
					<Obfuscated>Privacy right at your fingertips.</Obfuscated>
				</h2>
				<div
					className="theme-button"
					onClick={() => this.layout.current.setState({ expanded: true })}
				>
					<Obfuscated>Get Started</Obfuscated>
				</div>
			</main>
		);
	}
}
