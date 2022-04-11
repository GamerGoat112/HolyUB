import { Component, createRef, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.js';

const Home = lazy(() => import(/* webpackPrefetch: true */ './Pages/Home.js'));
const Games = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Games.js')
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
const Proxy = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Proxy.js')
);
const Ultraviolet = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Proxies/Ultraviolet.js')
);
const Rammerhead = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Proxies/Rammerhead.js')
);
const Stomp = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Proxies/Stomp.js')
);
const Licenses = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Licenses.js')
);
const Terms = lazy(() =>
	import(/* webpackPrefetch: true */ './Pages/Terms.js')
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
						path="/proxy.html"
						element={
							<Suspense fallback={<></>}>
								<Proxy layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="/games.html"
						element={
							<Suspense fallback={<></>}>
								<Games layout={this.layout} />
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
						path="/terms.html"
						element={
							<Suspense fallback={<></>}>
								<Terms layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="/licenses.html"
						element={
							<Suspense fallback={<></>}>
								<Licenses layout={this.layout} />
							</Suspense>
						}
					/>
				</Route>
				<Route path="/proxies/">
					<Route
						path="rh.html"
						element={
							<Suspense fallback={<></>}>
								<Rammerhead layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="st.html"
						element={
							<Suspense fallback={<></>}>
								<Stomp layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="uv.html"
						element={
							<Suspense fallback={<></>}>
								<Ultraviolet layout={this.layout} />
							</Suspense>
						}
					/>
				</Route>
				<Route
					path="*"
					element={
						<Layout
							element={
								<Suspense fallback={<></>}>
									<NotFound layout={this.layout} />
								</Suspense>
							}
						/>
					}
				/>
			</Routes>
		);
	}
}
