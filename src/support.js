import { Link } from 'react-router-dom';
import { Obfuscated, ObfuscatedA } from './obfuscate';

export const qna = [
	{
		q: (
			<>
				The proxy is <Obfuscated>slow</Obfuscated>.
			</>
		),
		a: (
			<>
				Our <Obfuscated>proxy</Obfuscated> servers are paid for by our
				supporters on{' '}
				<ObfuscatedA href="https://www.patreon.com/holyunblocker">
					<Obfuscated>Patreon</Obfuscated>
				</ObfuscatedA>
				. If you subscribe, you can help us purchase faster servers in the
				future.
			</>
		),
	},
	{
		q: <>My page won't load.</>,
		a: (
			<>
				Your page may be incompatible with our <Obfuscated>proxy</Obfuscated>.
				Give the website at most 1 minute to load.
			</>
		),
	},
	{
		q: (
			<>
				Can I host my own <Obfuscated>proxy site</Obfuscated>?
			</>
		),
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
				How can I contribute to the <Obfuscated>proxies</Obfuscated> on this
				website?
			</>
		),
		a: (
			<>
				The proxies used on this website can be found in{' '}
				<Link to="/licenses.html">licenses and open-source credits</Link>.
			</>
		),
	},
	{
		q: (
			<>
				Is my information on the <Obfuscated>proxy</Obfuscated> secure?
			</>
		),
		a: (
			<>
				We do not collect any data, your information is only as secure as the
				sites you are accessing. For privacy concerns, you can review our{' '}
				<Link to="/privacy.html">Privacy Policy</Link>.
			</>
		),
	},
];
