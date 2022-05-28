import './styles/Footer.scss';
import { Obfuscated } from './obfuscate.js';
import { ReactComponent as Waves } from './assets/waves.svg';
import resolveRoute from './resolveRoute.js';
import { ThemeLink } from './ThemeElements.js';

export default function Footer() {
	return (
		<footer>
			<Waves />
			<div className="background">
				<div className="content">
					<ThemeLink to={resolveRoute('/', 'credits')}>Credits</ThemeLink>
					<ThemeLink to={resolveRoute('/', 'contact')}>Contact</ThemeLink>
					<ThemeLink to={resolveRoute('/', 'privacy')}>Privacy</ThemeLink>
					<ThemeLink to={resolveRoute('/', 'terms')}>Terms of use</ThemeLink>
					<span>
						&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
						{new Date().getUTCFullYear()}
					</span>
				</div>
			</div>
		</footer>
	);
}
