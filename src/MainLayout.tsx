import './styles/Navigation.scss';
import './styles/Footer.scss';
import Footer from './Footer';
import { ReactComponent as HatBeta } from './assets/hat-beta.svg';
import { ReactComponent as HatDev } from './assets/hat-dev.svg';
import { ReactComponent as HatPlain } from './assets/hat.svg';
import { ObfuscateLayout, Obfuscated, ObfuscatedA } from './obfuscate';
import categories from './pages/theatre/games/categories';
import resolveRoute from './resolveRoute';
import {
	Apps,
	Home,
	HomeOutlined,
	List,
	Menu,
	QuestionMark,
	Settings,
	SortRounded,
	StarOutlineRounded,
	StarRounded,
	WebAsset,
} from '@mui/icons-material';
import type { MouseEventHandler, ReactNode, SVGAttributes } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function Hat(props: SVGAttributes<{}>) {
	switch (process.env.REACT_APP_HAT_BADGE) {
		case 'DEV':
			return <HatDev {...props} />;
		case 'BETA':
			return <HatBeta {...props} />;
		default:
			return <HatPlain {...props} />;
	}
}

export function MenuTab({
	route,
	href,
	name,
	iconFilled,
	iconOutlined,
}: {
	route?: string;
	href?: string;
	name: string;
	iconFilled: ReactNode;
	iconOutlined?: ReactNode;
	onClick?: MouseEventHandler;
}) {
	const location = useLocation();
	const selected = location.pathname === route;
	const content = (
		<>
			<span className="icon">
				{(selected && iconFilled) || iconOutlined || iconFilled}
			</span>
			<span className="name">
				<Obfuscated ellipsis>{name}</Obfuscated>
			</span>
		</>
	);

	if (route === undefined) {
		return (
			<ObfuscatedA
				href={href!}
				data-selected={Number(selected)}
				className="entry"
			>
				{content}
			</ObfuscatedA>
		);
	} else {
		return (
			<Link to={route} data-selected={Number(selected)} className="entry">
				{content}
			</Link>
		);
	}
}

export interface MainLayoutRef {
	expanded: boolean;
	setExpanded: (state: boolean | ((prevState: boolean) => boolean)) => void;
}

const MainLayout = forwardRef<MainLayoutRef>(function MainLayout(props, ref) {
	const [expanded, setExpanded] = useState(false);

	useImperativeHandle(
		ref,
		() => ({
			expanded,
			setExpanded,
		}),
		[expanded, setExpanded]
	);

	useEffect(() => {
		function keydown(event: KeyboardEvent) {
			if (expanded && event.key === 'Escape') {
				setExpanded(false);
			}
		}

		document.addEventListener('keydown', keydown);

		return () => document.removeEventListener('keydown', keydown);
	}, [expanded]);

	useEffect(() => {
		document.documentElement.dataset.expanded = Number(expanded).toString();
	}, [expanded]);

	function closeMenu() {
		setExpanded(false);
	}

	return (
		<>
			<ObfuscateLayout />
			<nav className="fixed-wide">
				<div className="button" onClick={() => setExpanded(true)}>
					<Menu />
				</div>
				<Link to="/" className="entry logo">
					<Hat />
				</Link>
				<div className="shift-right"></div>
				<Link className="button" to={resolveRoute('/settings/', 'search')}>
					<Settings />
				</Link>
			</nav>
			<div className="content">
				<div className="cover fixed-wide" onClick={closeMenu}></div>
				<div tabIndex={0} className="menu">
					<div className="top">
						<div className="button" onClick={closeMenu}>
							<Menu />
						</div>
						<Link to="/" className="entry logo" onClick={closeMenu}>
							<Hat />
						</Link>
					</div>
					<div className="menu-list">
						<MenuTab
							route={resolveRoute('/', '')}
							name="Home"
							iconFilled={<Home />}
							iconOutlined={<HomeOutlined />}
							onClick={closeMenu}
						/>
						<MenuTab
							route={resolveRoute('/', 'proxy')}
							name="Proxy"
							iconFilled={<WebAsset />}
							onClick={closeMenu}
						/>
						<MenuTab
							route={resolveRoute('/', 'faq')}
							name="FAQ"
							iconFilled={<QuestionMark />}
							onClick={closeMenu}
						/>

						<div className="bar" />

						<MenuTab
							route={resolveRoute('/theatre/', 'apps')}
							name="Apps"
							iconFilled={<Apps />}
							onClick={closeMenu}
						/>

						<MenuTab
							route={resolveRoute('/theatre/', 'favorites')}
							name="Favorites"
							iconFilled={<StarRounded />}
							iconOutlined={<StarOutlineRounded />}
							onClick={closeMenu}
						/>

						<div className="bar" />

						<div className="title">
							<Obfuscated>Games</Obfuscated>
						</div>

						<MenuTab
							route={resolveRoute('/theatre/games/', '')}
							name="Popular"
							iconFilled={<SortRounded />}
							onClick={closeMenu}
						/>
						<MenuTab
							route={resolveRoute('/theatre/games/', 'all')}
							name="All"
							iconFilled={<List />}
							onClick={closeMenu}
						/>
						<div className="title">Genre</div>
						<div className="genres">
							{categories.map((category) => (
								<Link
									key={category.id}
									to={`${resolveRoute('/theatre/', 'category')}?id=${
										category.id
									}`}
									className="entry text"
									onClick={() => setExpanded(false)}
								>
									<Obfuscated>{category.short || category.name}</Obfuscated>
								</Link>
							))}
						</div>
					</div>
				</div>
				<Outlet />
				<Footer />
			</div>
		</>
	);
});

export default MainLayout;
