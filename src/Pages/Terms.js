import { Component } from 'react';
import { Link } from 'react-router-dom';
import obfuscate from '../obfuscate.js';
import { set_page } from '../root.js';

export default class Terms extends Component {
	render() {
		set_page('contact');

		return (
			<main>
				<h2>Security</h2>
				<p>
					{obfuscate(<>Holy Unblocker</>)} highly values the terms of security
					using the latest security practices while guaranteeing secure
					connections over SSL and respecting user privacy entirely.
					<br />
				</p>
				<h2>Cookie Usage</h2>
				<p>
					{obfuscate(<>Holy Unblocker</>)} uses "Cookies" and similar
					technologies to maintain a user session (described more below) and
					store your preferences on your computer. All of this information is
					completely private being only local content with no analytical
					purposes.
				</p>
				<p>
					A cookie is a string of information that a website stores on a
					visitor's computer, and that the visitor's browser provides to the
					website each time the visitor returns.{' '}
					{obfuscate(<>Holy Unblocker</>)} uses cookies to help{' '}
					{obfuscate(<>Holy Unblocker</>)} with security on{' '}
					{global.location.hostname} and its proxy instances, and lastly for
					user preferences. Users who do not wish to have cookies placed on
					their computers should set their browsers to refuse cookies before
					using {obfuscate(<>Holy Unblocker</>)}'s websites, with the drawback
					that certain features of {obfuscate(<>Holy Unblocker</>)} may not
					function properly without the aid of cookies.
				</p>
				<p>
					By continuing to navigate our website without changing your cookie
					settings, you hereby acknowledge and agree to{' '}
					{obfuscate(<>Holy Unblocker</>)}'s use of cookies.
				</p>
				<h2>Subject to changes</h2>
				<p>
					Although most changes are likely to be minor,{' '}
					{obfuscate(<>Holy Unblocker</>)} may change its Privacy Policy from
					time to time, and in {obfuscate(<>Holy Unblocker</>)}'s sole
					discretion. {obfuscate(<>Holy Unblocker</>)} encourages visitors to
					frequently check this page for any changes to its Privacy Policy. Your
					continued use of this site after any change in this Privacy Policy
					will constitute your acceptance of such change.
				</p>
				<h2>Contact Information &amp; Credit</h2>
				<p>
					If you have any questions about our Privacy Policy, please{' '}
					<Link to="/contact.html">Contact Us</Link>.
				</p>
			</main>
		);
	}
}
