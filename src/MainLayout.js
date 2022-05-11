import { ObfuscateLayout, Obfuscated, ObfuscatedA } from './obfuscate.js';
import { ReactComponent as HatSVG } from './assets/hat-small.svg';
import { ReactComponent as WavesSVG } from './assets/waves.svg';
import { ReactComponent as Patreon } from './assets/patreon.svg';
import { createRef, forwardRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import categories from './pages/games/categories.json';
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
} from '@mui/icons-material';
import Layout from './Layout.js';
import './styles/Navigation.scss';
import './styles/Footer.scss';
import { PATREON_URL } from './root.js';
import { resolveRoute } from './Routes.js';

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
	last_location = this.props.location.toString();
	nav = createRef();
	constructor(props) {
		super(props);

		this.listen_keydown = this.keydown.bind(this);
	}
	keydown(event) {
		if (this.state.expanded && event.key === 'Escape') {
			this.setState({
				expanded: false,
			});
		}
	}
	componentDidMount() {
		document.addEventListener('keydown', this.listen_keydown);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.listen_keydown);
	}
	render() {
		if (this.props.location.toString() !== this.last_location) {
			this.state.expanded = false;

			this.last_location = this.props.location.toString();
		}

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
						<HatSVG />
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
					<div tabIndex="0" className="menu" ref={this.menu}>
						<div className="top">
							<div
								className="button"
								onClick={() => this.setState({ expanded: false })}
							>
								<Menu />
							</div>
							<Link to="/" className="entry logo">
								<HatSVG />
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
								iconFilled={
									<Patreon style={{ width: '18px', height: '18px' }} />
								}
								layout={this}
							/>

							<div className="bar" />

							<div className="title">
								<Obfuscated>Games</Obfuscated>
							</div>

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
					<footer>
						<WavesSVG />
						<div className="background">
							<div className="content">
								<Link to={resolveRoute('/', 'credits')}>Credits</Link>
								<Link to={resolveRoute('/', 'contact')}>Contact</Link>
								<Link to={resolveRoute('/', 'privacy')}>Privacy</Link>
								<Link to={resolveRoute('/', 'terms')}>Terms of use</Link>
								<span>
									&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
									{new Date().getUTCFullYear()}
								</span>
							</div>
						</div>
					</footer>
				</div>
			</>
		);
	}
}

export default forwardRef((props, ref) => {
	return <MainLayout ref={ref} location={useLocation()} {...props} />;
});
