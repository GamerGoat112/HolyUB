import '../styles/Home.scss';
import type { HolyPage } from '../App';
import { ThemeButton } from '../ThemeElements';
import { Obfuscated } from '../obfuscate';

const Home: HolyPage = ({ mainLayout }) => {
	return (
		<main className="home">
			<h1>
				<Obfuscated>End Internet Censorship.</Obfuscated>
			</h1>
			<h2>
				<Obfuscated>Privacy right at your fingertips.</Obfuscated>
			</h2>
			<ThemeButton
				onClick={() =>
					mainLayout.current && mainLayout.current.setExpanded(true)
				}
			>
				<Obfuscated>Get Started</Obfuscated>
			</ThemeButton>
		</main>
	);
};

export default Home;
