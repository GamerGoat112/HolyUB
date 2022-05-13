import { Obfuscated } from './obfuscate.js';
import { ReactComponent as Waves } from './assets/waves.svg';
import { Link } from 'react-router-dom';
import resolveRoute from './resolveRoute.js';
import './styles/Footer.scss';

export default function Footer() {
	return (
		<footer>
			<Waves />
			<div className="background">
				<div className="content">
					<Link className="theme-link" to={resolveRoute('/', 'credits')}>
						Credits
					</Link>
					<Link className="theme-link" to={resolveRoute('/', 'contact')}>
						Contact
					</Link>
					<Link className="theme-link" to={resolveRoute('/', 'privacy')}>
						Privacy
					</Link>
					<Link className="theme-link" to={resolveRoute('/', 'terms')}>
						Terms of use
					</Link>
					<span>
						&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
						{new Date().getUTCFullYear()}
					</span>
				</div>
			</div>
		</footer>
	);
}
