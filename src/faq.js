import { TN_DISCORD_URL } from './consts.js';
import { Obfuscated } from './obfuscate.js';
import resolveRoute from './resolveRoute.js';
import { ObfuscatedThemeA, ThemeLink } from './ThemeElements.js';

const faq = [
	{
		q: <>How do I get more links?.</>,
		a: (
			<>
				<Obfuscated>You can join the</Obfuscated>{' '}
				<ObfuscatedThemeA href={TN_DISCORD_URL}>
					<Obfuscated>TitaniumNetwork Discord Server</Obfuscated>
				</ObfuscatedThemeA>{' '}
				<Obfuscated>to receive more links. Go to</Obfuscated>{' '}
				<ObfuscatedThemeA href="https://discord.com/channels/419123358698045453/743648232717942805">
					<Obfuscated>#proxy-commands</Obfuscated>
				</ObfuscatedThemeA>{' '}
				and type:
				<code className="obfuscated">
					<Obfuscated>/proxy</Obfuscated>
				</code>
				<Obfuscated>, select HolyUnblocker, then enter.</Obfuscated>
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
				<ObfuscatedThemeA href="https://git.holy.how/holy">
					Git repository
				</ObfuscatedThemeA>
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
				<ThemeLink to={resolveRoute('/', 'credits')}>
					credits and open-source licenses
				</ThemeLink>
				.
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
				<ThemeLink to={resolveRoute('/', 'privacy')}>Privacy Policy</ThemeLink>.
			</>
		),
	},
];

export default faq;
