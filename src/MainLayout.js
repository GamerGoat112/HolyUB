import { ObfuscateLayout, Obfuscated, ObfuscatedA } from './obfuscate.js';
import { ReactComponent as Patreon } from './assets/patreon.svg';
import { createRef, forwardRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import categories from './pages/games/categories.js';
import {
	Home,
	HomeOutlined,
	QuestionMark,
	SortRounded,
	StarOutlineRounded,
	StarRounded,
	WebAsset,
	Menu,
	Settings,
	ShoppingCart,
	Apps,
} from '@mui/icons-material';
import Layout from './Layout.js';
import './styles/Navigation.scss';
import './styles/Footer.scss';
import { PATREON_URL } from './root.js';
import resolveRoute from './resolveRoute.js';
import process from 'process';
import { ReactComponent as HatDev } from './assets/hat-dev.svg';
import { ReactComponent as HatBeta } from './assets/hat-beta.svg';
import { ReactComponent as HatPlain } from './assets/hat.svg';

function Hat(props) {
	const { children, ...attributes } = props;

	switch (process.env.REACT_APP_HAT_BADGE) {
		case 'DEV':
			return <HatDev {...attributes}>{children}</HatDev>;
		case 'BETA':
			return <HatBeta {...attributes}>{children}</HatBeta>;
		default:
			return <HatPlain {...attributes}>{children}</HatPlain>;
	}
}

export function MenuTab(props) {
	const { route, href, iconFilled, iconOutlined, name, ...attributes } = props;
	const location = useLocation();
	const selected = location.pathname === route;
	const content = (
		<>
			<span className="icon">
				{(selected && iconFilled) || iconOutlined || iconFilled}
			</span>
			<span className="name">
				<Obfuscated>{name}</Obfuscated>
			</span>
		</>
	);

	if (route === undefined) {
		return (
			<ObfuscatedA
				href={href}
				data-selected={Number(selected)}
				className="entry"
				{...attributes}
			>
				{content}
			</ObfuscatedA>
		);
	} else {
		return (
			<Link
				to={route}
				data-selected={Number(selected)}
				className="entry"
				{...attributes}
			>
				{content}
			</Link>
		);
	}
}

function MainMenuTab(props) {
	const { layout, ...attributes } = props;
	return (
		<MenuTab
			onClick={() => {
				layout.setState({
					expanded: false,
				});
			}}
			{...attributes}
		/>
	);
}

class MainLayout extends Layout {
	nav = createRef();
	constructor(props) {
		super(props);

		this.listen_keydown = this.keydown.bind(this);
	}
	render() {
		const ui_categories = [];

		for (let id in categories) {
			const { short, name } = categories[id];
			ui_categories.push(
				<Link
					key={id}
					to={`${resolveRoute('/games/', 'category')}?id=${id}`}
					className="entry text"
					onClick={() => {
						this.setState({
							expanded: false,
						});
					}}
				>
					<Obfuscated>{short || name}</Obfuscated>
				</Link>
			);
		}

		return (
			<>
				{super.render()}
				<ObfuscateLayout />
				<nav ref={this.nav}>
					<div
						className="button"
						onClick={() => this.setState({ expanded: true })}
					>
						<Menu />
					</div>
					<Link to="/" className="entry logo">
						<Hat />
					</Link>
					<div className="shift-right"></div>
					<Link
						className="button"
						to={resolveRoute('/settings/', 'search')}
						onClick={() => this.setState({ expanded: false })}
					>
						<Settings />
					</Link>
				</nav>
				<div className="content">
					<div
						className="cover"
						onClick={() => this.setState({ expanded: false })}
					></div>
					<div tabIndex={0} className="menu" ref={this.menu}>
						<div className="top">
							<div
								className="button"
								onClick={() => this.setState({ expanded: false })}
							>
								<Menu />
							</div>
							<Link
								to="/"
								className="entry logo"
								onClick={() => this.setState({ expanded: false })}
							>
								<Hat />
							</Link>
						</div>
						<div className="menu-list">
							<MainMenuTab
								route={resolveRoute('/', '')}
								name="Home"
								iconFilled={<Home />}
								iconOutlined={<HomeOutlined />}
								layout={this}
							/>
							<MainMenuTab
								route={resolveRoute('/', 'proxy')}
								name="Proxy"
								iconFilled={<WebAsset />}
								layout={this}
							/>
							<MainMenuTab
								route={resolveRoute('/', 'faq')}
								name="FAQ"
								iconFilled={<QuestionMark />}
								layout={this}
							/>
							<div className="bar" />
							<MainMenuTab
								route={resolveRoute('/', 'privatelinks')}
								name="Private Links"
								iconFilled={<ShoppingCart />}
								layout={this}
							/>
							<MainMenuTab
								href={PATREON_URL}
								name="Patreon"
								iconFilled={<Patreon style={{ width: 18, height: 18 }} />}
								layout={this}
							/>
							<div className="bar" />
							<div className="title">
								<Obfuscated>Games</Obfuscated>
							</div>
							<MainMenuTab
								route={resolveRoute('/games/', 'all')}
								name="All"
								iconFilled={<Apps />}
								layout={this}
							/>{' '}
							<MainMenuTab
								route={resolveRoute('/games/', 'popular')}
								name="Popular"
								iconFilled={<SortRounded />}
								layout={this}
							/>
							<MainMenuTab
								route={resolveRoute('/games/', 'favorites')}
								name="Favorites"
								iconFilled={<StarRounded />}
								iconOutlined={<StarOutlineRounded />}
								layout={this}
							/>
							<div className="title">Genre</div>
							<div className="genres">{ui_categories}</div>
						</div>
					</div>
					<Outlet />
				</div>
			</>
		);
	}
}

export default forwardRef((props, ref) => {
	return <MainLayout ref={ref} location={useLocation()} {...props} />;
});
