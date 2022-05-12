import { Component } from 'react';
import { Obfuscated } from '../obfuscate.js';
import '../styles/Home.scss';
import { ThemeButton } from '../ThemeElements.js';

export default class Home extends Component {
	componentDidMount() {
		this.props.layout.current.setState({ page: 'home' });
	}
	render() {
		return (
			<main>
				<h1>
					<Obfuscated>End Internet Censorship.</Obfuscated>
				</h1>
				<h2>
					<Obfuscated>Privacy right at your fingertips.</Obfuscated>
				</h2>
				<ThemeButton
					onClick={() => this.props.layout.current.setState({ expanded: true })}
				>
					<Obfuscated>Get Started</Obfuscated>
				</ThemeButton>
			</main>
		);
	}
}
