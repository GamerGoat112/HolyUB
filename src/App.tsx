import './styles/App.scss';
import type { CompatLayoutRef } from './CompatLayout';
import CompatLayout from './CompatLayout';
import type { LayoutRef } from './Layout';
import Layout from './Layout';
import type { MainLayoutRef } from './MainLayout';
import MainLayout from './MainLayout';
import categories from './gameCategories';
import resolveRoute from './resolveRoute';
import type { ComponentType, RefObject } from 'react';
import { Suspense, lazy, useRef } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

const GamesPopular = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/games/Popular')
);
const TheatreFavorites = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/Favorites')
);
const TheatreCategory = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/Category')
);
const TheatrePlayer = lazy(
	() => import(/* webpackPrefetch: true */ './pages/theatre/Player')
);
const Home = lazy(() => import(/* webpackPrefetch: true */ './pages/Home'));
const Settings = lazy(
	() => import(/* webpackPrefetch: true */ './pages/Settings')
);
const SearchSettings = lazy(
	() => import(/* webpackPrefetch: true */ './pages/settings/Search')
);
const AppearanceSettings = lazy(
	() => import(/* webpackPrefetch: true */ './pages/settings/Appearance')
);
const TabCloakSettings = lazy(
	() => import(/* webpackPrefetch: true */ './pages/settings/TabCloak')
);
const FAQ = lazy(() => import(/* webpackPrefetch: true */ './pages/FAQ'));
const Contact = lazy(
	() => import(/* webpackPrefetch: true */ './pages/Contact')
);
const Privacy = lazy(
	() => import(/* webpackPrefetch: true */ './pages/Privacy')
);
const NotFound = lazy(
	() => import(/* webpackPrefetch: true */ './pages/NotFound')
);
const Proxy = lazy(() => import(/* webpackPrefetch: true */ './pages/Proxy'));
const Credits = lazy(
	() => import(/* webpackPrefetch: true */ './pages/Credits')
);
const Terms = lazy(() => import(/* webpackPrefetch: true */ './pages/Terms'));
const Ultraviolet = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/Ultraviolet')
);
const Rammerhead = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/Rammerhead')
);
const Stomp = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/Stomp')
);
const Flash = lazy(
	() => import(/* webpackPrefetch: true */ './pages/compat/Flash')
);

const PlayerProxy: HolyPage = (props) => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;

	return (
		<Suspense fallback={<></>}>
			<TheatrePlayer {...props} key={id} id={id} />
		</Suspense>
	);
};

const CategoryProxy: HolyPage = (props) => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;
	const category = categories.find((category) => category.id === id);

	if (!category) return <>Bad category ID</>;

	return (
		<Suspense fallback={<></>}>
			<TheatreCategory
				{...props}
				key={id}
				name={category.name}
				category={id}
				id={id}
				placeholder="Search by game name"
			/>
		</Suspense>
	);
};

export interface LayoutDump {
	layout: RefObject<LayoutRef | null>;
	mainLayout: RefObject<MainLayoutRef | null>;
	compatLayout: RefObject<CompatLayoutRef | null>;
}

export type HolyPage<T extends object = {}> = ComponentType<LayoutDump & T>;

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default function App() {
	const layout = useRef<LayoutRef | null>(null);
	const mainLayout = useRef<MainLayoutRef | null>(null);
	const compatLayout = useRef<CompatLayoutRef | null>(null);

	const layouts: LayoutDump = {
		layout,
		mainLayout,
		compatLayout,
	};

	return (
		<>
			<Layout ref={layout} />
			<Routes>
				<Route path={resolveRoute('/', '')} element={<MainLayout />}>
					<Route
						index
						element={
							<Suspense fallback={<></>}>
								<Home {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'proxy', false)}
						element={
							<Suspense fallback={<></>}>
								<Proxy {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'faq', false)}
						element={
							<Suspense fallback={<></>}>
								<FAQ {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'contact', false)}
						element={
							<Suspense fallback={<></>}>
								<Contact {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'privacy', false)}
						element={
							<Suspense fallback={<></>}>
								<Privacy {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'terms', false)}
						element={
							<Suspense fallback={<></>}>
								<Terms {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/', 'credits', false)}
						element={
							<Suspense fallback={<></>}>
								<Credits {...layouts} />
							</Suspense>
						}
					/>
					<Route path={resolveRoute('/theatre/games/', '')}>
						<Route
							index
							element={
								<Suspense fallback={<></>}>
									<GamesPopular {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/theatre/games/', 'all', false)}
							element={
								<Suspense fallback={<></>}>
									<TheatreCategory
										name="All Games"
										id="all"
										key="all"
										showCategory
										category={categories
											.map((category) => category.id)
											.join(',')}
										placeholder="Search by game name"
										{...layouts}
									/>
								</Suspense>
							}
						/>
					</Route>
					<Route path={resolveRoute('/theatre/', '')}>
						<Route
							path={resolveRoute('/theatre/', 'player', false)}
							element={<PlayerProxy {...layouts} />}
						/>
						<Route
							path={resolveRoute('/theatre/', 'category', false)}
							element={<CategoryProxy {...layouts} />}
						/>
						<Route
							path={resolveRoute('/theatre/', 'favorites', false)}
							element={
								<Suspense fallback={<></>}>
									<TheatreFavorites {...layouts} />
								</Suspense>
							}
						/>
						<Route path={resolveRoute('/theatre/', 'apps', false)}>
							<Route
								index
								element={
									<Suspense fallback={<></>}>
										<TheatreCategory
											name="Apps"
											id="apps"
											key="apps"
											category="app"
											placeholder="Search by app name"
											{...layouts}
										/>
									</Suspense>
								}
							/>
						</Route>
					</Route>
					<Route
						path={resolveRoute('/settings/', '')}
						element={
							<Suspense fallback={<></>}>
								<Settings {...layouts} />
							</Suspense>
						}
					>
						<Route
							path={resolveRoute('/settings/', 'search', false)}
							element={
								<Suspense fallback={<></>}>
									<SearchSettings {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/settings/', 'appearance', false)}
							element={
								<Suspense fallback={<></>}>
									<AppearanceSettings {...layouts} />
								</Suspense>
							}
						/>
						<Route
							path={resolveRoute('/settings/', 'tabcloak', false)}
							element={
								<Suspense fallback={<></>}>
									<TabCloakSettings {...layouts} />
								</Suspense>
							}
						/>
					</Route>
					<Route
						path="*"
						element={
							<Suspense fallback={<></>}>
								<NotFound {...layouts} />
							</Suspense>
						}
					/>
				</Route>
				<Route
					path={resolveRoute('/compat/', '')}
					element={<CompatLayout ref={compatLayout} />}
				>
					<Route
						path={resolveRoute('/compat/', 'rammerhead', false)}
						element={
							<Suspense fallback={<></>}>
								<Rammerhead {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/compat/', 'stomp', false)}
						element={
							<Suspense fallback={<></>}>
								<Stomp {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/compat/', 'ultraviolet', false)}
						element={
							<Suspense fallback={<></>}>
								<Ultraviolet {...layouts} />
							</Suspense>
						}
					/>
					<Route
						path={resolveRoute('/compat/', 'flash', false)}
						element={
							<Suspense fallback={<></>}>
								<Flash {...layouts} />
							</Suspense>
						}
					/>
				</Route>
			</Routes>
		</>
	);
}
