import './styles/Footer.scss';
import { ThemeLink } from './ThemeElements';
import { ReactComponent as Waves } from './assets/waves.svg';
import { Obfuscated } from './obfuscate';
import resolveRoute from './resolveRoute';

export default function Footer() {
	return (
		<footer>
			<Waves />
			<div className="background">
				<div className="content">
					<div className="shift-right" />
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