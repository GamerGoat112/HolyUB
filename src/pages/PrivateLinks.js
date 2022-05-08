import { Component } from 'react';
import { ObfuscatedA } from '../obfuscate.js';
import { set_page, VOUCHER_URL } from '../root.js';
import '../styles/PrivateLinks.scss';

export default class PrivateLinks extends Component {
	render() {
		set_page('private-links');

		return (
			<main>
				<p>
					To use this service, you will need a voucher. Purchase a voucher{' '}
					<ObfuscatedA href={VOUCHER_URL}>here</ObfuscatedA>.
				</p>
				<form
					onSubmit={event => {
						event.preventDefault();
					}}
					className="redeem"
				>
					<input placeholder="Domain"></input>
					<div className="tld"></div>
				</form>
			</main>
		);
	}
}
