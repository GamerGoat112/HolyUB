import { Component } from 'react';
import { set_page } from '../root.js';
import { Link } from 'react-router-dom';
import faq from '../faq.js';

export default class FAQ extends Component {
	state = {
		search: '',
	};
	render() {
		set_page('faq');

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
			<>
				<main>
					{sections}
					<p style={{ marginTop: '30px', opacity: 0.75 }}>
						Not what you're looking for?{' '}
						<Link to="/contact.html">Contact Us</Link>.
					</p>
				</main>
			</>
		);
	}
}
