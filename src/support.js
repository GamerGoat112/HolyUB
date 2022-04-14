import { Link } from 'react-router-dom';
import obfuscate, { ObfuscatedA } from './obfuscate';

export const qna = [
	{
		q: <>My page won't load.</>,
		a: (
			<>
				Your page may be incompatible with our {obfuscate(<>proxy</>)}. Give the
				website at most 1 minute to load.
			</>
		),
	},
	{
		q: <>Can I host my own {obfuscate(<>proxy site</>)}?</>,
		a: (
			<>
				Yes. This website is open source. See our{' '}
				<ObfuscatedA href="https://git.holy.how/holy">
					Git repository
				</ObfuscatedA>
				.
			</>
		),
	},
	{
		q: (
			<>
				How can I contribute to the {obfuscate(<>proxies</>)} on this website?
			</>
		),
		a: (
			<>
				The proxies used on this website can be found in the{' '}
				<Link to="/licenses.html">licenses and open-source credits</Link>.
			</>
		),
	},
	{
		q: <>Is my information on the {obfuscate(<>proxy</>)} secure?</>,
		a: (
			<>
				We do not collect any data, your information is only as secure as the
				sites you are visiting on them. For privacy concerns, you can review our{' '}
				<Link to="/privacy.html">Privacy Policy</Link>.
			</>
		),
	},
];
