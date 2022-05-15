import { Obfuscated } from '../obfuscate.js';
import { ThemeButton } from '../ThemeElements.js';
import '../styles/Home.scss';

export default function Home(props) {
	return (
		<main className="home">
			<h1>
				<Obfuscated>End Internet Censorship.</Obfuscated>
			</h1>
			<h2>
				<Obfuscated>Privacy right at your fingertips.</Obfuscated>
			</h2>
			<ThemeButton
				onClick={() => props.layout.current.setState({ expanded: true })}
			>
				<Obfuscated>Get Started</Obfuscated>
			</ThemeButton>
		</main>
	);
}
