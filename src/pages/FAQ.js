import { Link } from 'react-router-dom';
import resolveRoute from '../resolveRoute.js';
import faq from '../faq.js';
import Footer from '../Footer.js';
import { Notification } from '../Layout.js';
import { useEffect } from 'react';

export default function FAQ(props) {
	useEffect(() => {
		props.layout.current.notifications.current.add(
			<Notification description="Info" type="info" />
		);

		setTimeout(() => {
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
		}, 200);

		setTimeout(() => {
			props.layout.current.notifications.current.add(
				<Notification description="Error" type="error" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
			props.layout.current.notifications.current.add(
				<Notification description="Success" type="success" />
			);
		}, 400);
	});

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
			<main className="faq">
				{sections}
				<p style={{ marginTop: 30, opacity: 0.75 }}>
					Not what you're looking for?{' '}
					<Link className="theme-link" to={resolveRoute('/', 'contact')}>
						Contact Us
					</Link>
					.
				</p>
			</main>
			<Footer />
		</>
	);
}
