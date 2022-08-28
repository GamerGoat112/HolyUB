import type { HolyPage } from '../App';
import { ObfuscatedThemeA, ThemeLink } from '../ThemeElements';
import { TN_DISCORD_URL } from '../consts';
import { Obfuscated } from '../obfuscate';
import resolveRoute from '../resolveRoute';
import type { ReactNode } from 'react';

const faq: {
	q: ReactNode;
	a: ReactNode;
}[] = [
	{
		q: (
			<>
				<Obfuscated>How can I self-host Holy Unblocker?</Obfuscated>
			</>
		),
		a: (
			<>
				<Obfuscated>
					You can self-host/deploy Holy Unblocker by using our all-in-one script
				</Obfuscated>{' '}
				<ObfuscatedThemeA href="https://github.com/e9x/website-aio#website-aio">
					here
				</ObfuscatedThemeA>
				.
			</>
		),
	},
	{
		q: <>How do I get more links?</>,
		a: (
			<>
				<Obfuscated>You can join the</Obfuscated>{' '}
				<ObfuscatedThemeA href={TN_DISCORD_URL}>
					<Obfuscated>TitaniumNetwork Discord Server</Obfuscated>
				</ObfuscatedThemeA>{' '}
				<Obfuscated>
					to receive more links. In any channel, run the{' '}
					<code className="obfuscated">
						<Obfuscated>/proxy</Obfuscated>
					</code>{' '}
					command and select Holy Unblocker.
				</Obfuscated>
			</>
		),
	},
	{
		q: <>Where is this website's source code?</>,
		a: (
			<>
				The source code to this website can be found in our{' '}
				<ObfuscatedThemeA href="https://git.holy.how/holy/website">
					Git repository
				</ObfuscatedThemeA>
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

const FAQ: HolyPage = () => {
	const sections = [];

	for (let i = 0; i < faq.length; i++) {
		const { q, a } = faq[i];

		sections.push(
			<section key={i}>
				<h1>{q}</h1>
				<p>{a}</p>
			</section>
		);
	}

	return (
		<main className="faq">
			{sections}
			<p style={{ marginTop: 30, opacity: 0.75 }}>
				Not what you're looking for?{' '}
				<ThemeLink to={resolveRoute('/', 'contact')}>Contact Us</ThemeLink>.
			</p>
		</main>
	);
};

export default FAQ;
