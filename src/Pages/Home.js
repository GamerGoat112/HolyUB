import TypeWriter from '../TypeWriter.js';
import obfuscate from '../obfuscate.js';
import root from '../root.js';
import { Component, createRef } from 'react';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';
import { Link } from 'react-router-dom';

export default class Home extends Component {
	render() {
		root.dataset.page = 'home';

		return (
			<>
				<main></main>
			</>
		);
	}
}
