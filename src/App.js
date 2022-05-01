import { Component, createRef, lazy, Suspense } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import MainLayout from './MainLayout.js';
import ProxyLayout from './ProxyLayout.js';
import GamesLayout from './GamesLayout.js';
import './styles/App.scss';

const Home = lazy(() => import(/* webpackPrefetch: true */ './pages/Home.js'));
const GamesPopular = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/games/Popular.js')
);
const GamesFavorites = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/games/Favorites.js')
);
const GamesCategory = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/games/Category.js')
);
const GamesPlayer = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/games/Player.js')
);
const Support = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Support.js')
);
const Contact = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Contact.js')
);
const Privacy = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Privacy.js')
);
const NotFound = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/NotFound.js')
);
const Proxy = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Proxy.js')
);
const Licenses = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Licenses.js')
);
const Terms = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Terms.js')
);
const Ultraviolet = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/proxies/Ultraviolet.js')
);
const Rammerhead = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/proxies/Rammerhead.js')
);
const Stomp = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/proxies/Stomp.js')
);
const Flash = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/proxies/Flash.js')
);

function PlayerProxy(props) {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<Suspense fallback={<></>}>
			<GamesPlayer {...props} key={id} id={id} />
		</Suspense>
	);
}

function CategoryProxy(props) {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');

	return (
		<Suspense fallback={<></>}>
			<GamesCategory {...props} key={id} id={id} />
		</Suspense>
	);
}

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default class App extends Component {
	layout = createRef();
	render() {
		return (
			<Routes>
				<Route path="/" element={<MainLayout ref={this.layout} />}>
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
						path="/faq.html"
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
				<Route
					path="/games/"
					element={<GamesLayout ref={this.layout} layout={this.layout} />}
				>
					<Route
						path="popular.html"
						element={
							<Suspense fallback={<></>}>
								<GamesPopular layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="favorites.html"
						element={
							<Suspense fallback={<></>}>
								<GamesFavorites layout={this.layout} />
							</Suspense>
						}
					/>
					<Route
						path="player.html"
						element={<PlayerProxy layout={this.layout} />}
					/>
					<Route
						path="category.html"
						element={<CategoryProxy layout={this.layout} />}
					/>
				</Route>
				<Route path="/proxies/" element={<ProxyLayout ref={this.layout} />}>
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
					<Route
						path="flash.html"
						element={
							<Suspense fallback={<></>}>
								<Flash layout={this.layout} />
							</Suspense>
						}
					/>
				</Route>
				<Route
					path="*"
					element={
						<MainLayout
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
