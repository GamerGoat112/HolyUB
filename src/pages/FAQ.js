import { Component } from 'react';
import { Link } from 'react-router-dom';
import { resolveRoute } from '../Routes.js';
import faq from '../faq.js';

export default class FAQ extends Component {
	state = {
		search: '',
	};
	componentDidMount() {
		this.props.layout.current.setState({ page: 'faq' });
	}
	render() {
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
						<Link to={resolveRoute('/', 'contact')}>Contact Us</Link>.
					</p>
				</main>
			</>
		);
	}
}
