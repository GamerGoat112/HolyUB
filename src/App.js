import { Component, createRef, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.js';

const Home = lazy(() => import(/* webpackPrefetch: true */ './Pages/Home.js'));
const Theatre = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Theatre.js')
);
const Support = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Support.js')
);
const Contact = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Contact.js')
);
const Privacy = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Privacy.js')
);
const NotFound = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/NotFound.js')
);

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default class App extends Component {
	layout = createRef();
	render() {
		return (
			<Routes>
				<Route path="/" element={<Layout ref={this.layout} />}>
					<Route
						index
						element={
							<Suspense fallback={<></>}>
								<Home layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="/theatre.html"
						element={
							<Suspense fallback={<></>}>
								<Theatre layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="/support.html"
						element={
							<Suspense fallback={<></>}>
								<Support layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="/contact.html"
						element={
							<Suspense fallback={<></>}>
								<Contact layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="/privacy.html"
						element={
							<Suspense fallback={<></>}>
								<Privacy layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="*"
						element={
							<Suspense fallback={<></>}>
								<NotFound layout={this.layout} />
							</Suspense>
						}
					/>
				</Route>
			</Routes>
		);
	}
}
