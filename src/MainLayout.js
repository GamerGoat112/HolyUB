import { ObfuscateLayout, Obfuscated } from './obfuscate.js';
import { ReactComponent as HatSVG } from './assets/hat-small.svg';
import { ReactComponent as WavesSVG } from './assets/waves.svg';
import { createRef, forwardRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
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
} from '@mui/icons-material';
import Layout from './Layout.js';
import './styles/Navigation.scss';
import './styles/Footer.scss';

export function MenuTab(props) {
	const location = useLocation();
	const selected = location.pathname === props.route;

	return (
		<Link to={props.route} className="entry">
			<span className="icon">
				{(selected && props.iconFilled) ||
					props.iconOutlined ||
					props.iconFilled}
			</span>
			<span className="name">
				<Obfuscated>{props.name}</Obfuscated>
			</span>
		</Link>
	);
}

class MainLayout extends Layout {
	constructor(props) {
		super(props);

		this.state = {
			...this.state,
			expanded: !this.props.location.pathname.startsWith('/settings/'),
		};
	}
	nav = createRef();
	render() {
		this.update();

		return (
			<>
				{super.render()}
				<ObfuscateLayout />
				<nav
					className="main"
					ref={this.nav}
					data-expanded={Number(this.state.expanded)}
				>
					<div
						className="button"
						onClick={() => this.setState({ expanded: !this.state.expanded })}
					>
						<Menu />
					</div>
					<Link to="/" className="entry logo">
						<HatSVG />
					</Link>
					<div className="shift-right"></div>
					<Link
						className="button"
						to="/settings/general.html"
						onClick={() => this.setState({ expanded: false })}
					>
						<Settings />
					</Link>
				</nav>
				<div className="content">
					<div tabIndex="0" className="menu menu-like" ref={this.menu}>
						<MenuTab
							route="/"
							name="Home"
							iconFilled={<Home />}
							iconOutlined={<HomeOutlined />}
						/>
						<MenuTab
							route="/proxy.html"
							name="Proxy"
							iconFilled={<WebAsset />}
						/>
						<MenuTab
							route="/faq.html"
							name="FAQ"
							iconFilled={<QuestionMark />}
						/>

						<div className="bar" />

						<p>
							<Obfuscated>Games</Obfuscated>
						</p>

						<MenuTab
							route="/games/popular.html"
							name="Popular"
							iconFilled={<SortRounded />}
						/>
						<MenuTab
							route="/games/favorites.html"
							name="Favorites"
							iconFilled={<StarRounded />}
							iconOutlined={<StarOutlineRounded />}
						/>

						{/*<p>Genre</p><div className="genres">{ui_categories}</div>*/}
					</div>
					<Outlet />
				</div>
				<footer>
					<WavesSVG />
					<div className="background">
						<div className="content">
							<Link to="/licenses.html">Licenses</Link>
							<Link to="/contact.html">Contact</Link>
							<Link to="/privacy.html">Privacy</Link>
							<Link to="/terms.html">Terms of use</Link>
							<span>
								&copy; <Obfuscated>Holy Unblocker</Obfuscated>{' '}
								{new Date().getUTCFullYear()}
							</span>
						</div>
					</div>
				</footer>
			</>
		);
	}
}

export default forwardRef((props, ref) => {
	return <MainLayout ref={ref} location={useLocation()} {...props} />;
});
