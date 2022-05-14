import { createRef, lazy, Suspense } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import MainLayout from './MainLayout.js';
import CompatLayout from './CompatLayout.js';
import resolveRoute from './resolveRoute.js';
import './styles/App.scss';

const GamesAll = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/games/All.js')
);
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
const Home = lazy(() => import(/* webpackPrefetch: true */ './pages/Home.js'));
const PrivateLinks = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/PrivateLinks.js')
);
const Settings = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Settings.js')
);
const SearchSettings = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/settings/Search.js')
);
const AppearanceSettings = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/settings/Appearance.js')
);
const TabCloakSettings = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/settings/TabCloak.js')
);
const FAQ = lazy(() => import(/* webpackPrefetch: true */ './pages/FAQ.js'));
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
const Credits = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Credits.js')
);
const Terms = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/Terms.js')
);
const Ultraviolet = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/compat/Ultraviolet.js')
);
const Rammerhead = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/compat/Rammerhead.js')
);
const Stomp = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/compat/Stomp.js')
);
const Flash = lazy(() =>
	import(/* webpackPrefetch: true */ './pages/compat/Flash.js')
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
export default function App() {
	const layout = createRef();

	return (
		<Routes>
			<Route path={resolveRoute('/', '')} element={<MainLayout ref={layout} />}>
				<Route
					index
					element={
						<Suspense fallback={<></>}>
							<Home layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/', 'proxy')}
					element={
						<Suspense fallback={<></>}>
							<Proxy layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/', 'faq')}
					element={
						<Suspense fallback={<></>}>
							<FAQ layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/', 'contact')}
					element={
						<Suspense fallback={<></>}>
							<Contact layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/', 'privacy')}
					element={
						<Suspense fallback={<></>}>
							<Privacy layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/', 'privatelinks')}
					element={
						<Suspense fallback={<></>}>
							<PrivateLinks layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/', 'terms')}
					element={
						<Suspense fallback={<></>}>
							<Terms layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/', 'credits')}
					element={
						<Suspense fallback={<></>}>
							<Credits layout={layout} />
						</Suspense>
					}
				/>
				<Route path={resolveRoute('/games/', '')}>
					<Route
						path={resolveRoute('/games/', 'All', false)}
						element={
							<Suspense fallback={<></>}>
								<GamesAll layout={layout} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/games/', 'popular', false)}
						element={
							<Suspense fallback={<></>}>
								<GamesPopular layout={layout} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/games/', 'favorites', false)}
						element={
							<Suspense fallback={<></>}>
								<GamesFavorites layout={layout} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/games/', 'player', false)}
						element={<PlayerProxy layout={layout} />}
					/>
					<Route
						path={resolveRoute('/games/', 'category', false)}
						element={<CategoryProxy layout={layout} />}
					/>
				</Route>
				<Route
					path={resolveRoute('/settings/', '')}
					element={
						<Suspense fallback={<></>}>
							<Settings layout={layout} />
						</Suspense>
					}
				>
					<Route
						path={resolveRoute('/settings/', 'search', false)}
						element={
							<Suspense fallback={<></>}>
								<SearchSettings layout={layout} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/settings/', 'appearance', false)}
						element={
							<Suspense fallback={<></>}>
								<AppearanceSettings layout={layout} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/settings/', 'tabcloak', false)}
						element={
							<Suspense fallback={<></>}>
								<TabCloakSettings layout={layout} />
							</Suspense>
						}
					/>
				</Route>
				<Route
					path="*"
					element={
						<Suspense fallback={<></>}>
							<NotFound layout={layout} />
						</Suspense>
					}
				/>
			</Route>
			<Route
				path={resolveRoute('/compat/', '')}
				element={<CompatLayout ref={layout} />}
			>
				<Route
					path={resolveRoute('/compat/', 'rammerhead', false)}
					element={
						<Suspense fallback={<></>}>
							<Rammerhead layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/compat/', 'stomp', false)}
					element={
						<Suspense fallback={<></>}>
							<Stomp layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/compat/', 'ultraviolet', false)}
					element={
						<Suspense fallback={<></>}>
							<Ultraviolet layout={layout} />
						</Suspense>
					}
				/>
				<Route
					path={resolveRoute('/compat/', 'flash', false)}
					element={
						<Suspense fallback={<></>}>
							<Flash layout={layout} />
						</Suspense>
					}
				/>
			</Route>
		</Routes>
	);
}
