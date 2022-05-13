import { Obfuscated, ObfuscatedA } from '../obfuscate.js';
import { PATREON_URL } from '../root.js';

export default function Credits() {
	return (
		<main className="legal credits">
			<h2>Credits</h2>

			<h4>Operations</h4>

			<ul>
				<li>
					<Obfuscated>Eli - NFT/Bitcoin specialist</Obfuscated>
				</li>
				<li>
					<Obfuscated>Incoming - Accountant</Obfuscated>
				</li>
			</ul>

			<h4>Sponsors</h4>

			<ul>
				<li>
					<Obfuscated>Our</Obfuscated>{' '}
					<ObfuscatedA className="theme-link" href={PATREON_URL}>
						Patrons
					</ObfuscatedA>
					<Obfuscated>.</Obfuscated>
				</li>
				<li>
					<Obfuscated>The Kingdom of Saudi Arabia</Obfuscated>
				</li>
				<li>
					<Obfuscated>Jeff Bezos - Server hosting</Obfuscated>
				</li>
			</ul>

			<h4>Development</h4>

			<ul>
				<li>
					<Obfuscated>
						sexyduceduce - Frontend Developer, Ultraviolet
					</Obfuscated>
				</li>
				<li>
					<Obfuscated>Device - Frontend Developer, Stomp</Obfuscated>
				</li>
				<li>
					<Obfuscated>OlyB - Frontend Developer, WebRetro</Obfuscated>
				</li>
				<li>
					<Obfuscated>luphoria - Backend Developer</Obfuscated>
				</li>
				<li>
					<Obfuscated>Ender - Backend Developer</Obfuscated>
				</li>
				<li>
					<Obfuscated>011011000110111101101100 - Rammerhead</Obfuscated>
				</li>
			</ul>

			<h4>Community</h4>

			<ul>
				<li>
					<Obfuscated>Aub - Community Manager</Obfuscated>
				</li>
				<li>
					<Obfuscated>Degenerate - Chat Mod</Obfuscated>
				</li>
				<li>
					<Obfuscated>Simon - Chat Mod</Obfuscated>
				</li>
			</ul>

			<h2>Open-source licenses</h2>

			<ul>
				<li>
					<Obfuscated>Rammerhead:</Obfuscated>{' '}
					<ObfuscatedA
						className="theme-link"
						href="https://github.com/binary-person/rammerhead"
					>
						<Obfuscated>https://github.com/binary-person/rammerhead</Obfuscated>
					</ObfuscatedA>
				</li>
				<li>
					<Obfuscated>Ultraviolet:</Obfuscated>{' '}
					<ObfuscatedA
						className="theme-link"
						href="https://github.com/titaniumnetwork-dev/Ultraviolet"
					>
						<Obfuscated>
							https://github.com/titaniumnetwork-dev/Ultraviolet
						</Obfuscated>
					</ObfuscatedA>
				</li>
				<li>
					<Obfuscated>Stomp:</Obfuscated>{' '}
					<ObfuscatedA
						className="theme-link"
						href="https://github.com/sysce/stomp"
					>
						<Obfuscated>https://github.com/sysce/stomp</Obfuscated>
					</ObfuscatedA>
				</li>
			</ul>
		</main>
	);
}
