import { Component } from 'react';
import { Link } from 'react-router-dom';
import root from '../root.js';

export default class NotFound extends Component {
	render(){
		root.dataset.page = 'notfound';

		return (
			<main>
				<h1>The page you are looking for is not available.</h1>
				<hr />
				<p>
					If you typed in the URL yourself, please double-check the spelling.<br />
					If you got here from a lik within our site, please <Link to='/contact'>Contact Us</Link>.
				</p>
			</main>
		);
	}
};