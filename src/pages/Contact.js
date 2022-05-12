import { Component } from 'react';
import { Obfuscated, ObfuscatedA } from '../obfuscate.js';
import { HU_DISCORD_URL } from '../root.js';

export default class Contact extends Component {
	componentDidMount() {
		this.props.layout.current.setState({ page: 'contact' });
	}
	render() {
		return (
			<main>
				<h1>Contact:</h1>
				<ul>
					<li>
						GitHub:{' '}
						<ObfuscatedA
							className="theme-link"
							href="https://git.holy.how/holy"
						>
							<Obfuscated>https://git.holy.how/holy</Obfuscated>
						</ObfuscatedA>
					</li>
					<li>
						Email:{' '}
						<ObfuscatedA className="theme-link" href="mailto:support@holy.how">
							<Obfuscated>support@holy.how</Obfuscated>
						</ObfuscatedA>
					</li>
					<li>
						<Obfuscated>Discord</Obfuscated>:{' '}
						<ObfuscatedA className="theme-link" href={HU_DISCORD_URL}>
							<Obfuscated>{HU_DISCORD_URL}</Obfuscated>
						</ObfuscatedA>
					</li>
				</ul>
			</main>
		);
	}
}
