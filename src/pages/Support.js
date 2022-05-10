import { Component } from 'react';
import { set_page } from '../root.js';
import { Link } from 'react-router-dom';
import { qna } from '../support.js';

export default class Support extends Component {
	state = {
		search: '',
	};
	render() {
		set_page('support');

		const sections = [];

		for (let i = 0; i < qna.length; i++) {
			const { q, a } = qna[i];

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
