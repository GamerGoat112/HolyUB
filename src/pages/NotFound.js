import { Component } from 'react';
import { Link } from 'react-router-dom';
import { set_page } from '../root.js';

export default class NotFound extends Component {
	render() {
		set_page('notfound');

		return (
			<main>
				<h1>The page you are looking for is not available.</h1>
				<hr />
				<p>
					If you typed in the URL yourself, please double-check the spelling.
					<br />
					If you got here from a link within our site, please{' '}
					<Link to="/contact">Contact Us</Link>.
				</p>
			</main>
		);
	}
}
