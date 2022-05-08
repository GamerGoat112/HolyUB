import { ObfuscateLayout, Obfuscated } from './obfuscate.js';
import { ReactComponent as HatSVG } from './assets/hat-small.svg';
import { ReactComponent as WavesSVG } from './assets/waves.svg';
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
} from '@mui/icons-material';
import Layout from './Layout.js';
import './styles/Navigation.scss';
import './styles/Footer.scss';

export function MenuTab(props) {
	const { route, iconFilled, iconOutlined, name, ...attributes } = props;
	const location = useLocation();
	const selected = location.pathname === route;

	return (
		<Link
			to={route}
			data-selected={Number(selected)}
			className="entry"
			{...attributes}
		>
			<span className="icon">
				{(selected && iconFilled) || iconOutlined || iconFilled}
			</span>
			<span className="name">
				<Obfuscated>{name}</Obfuscated>
			</span>
		</Link>
	);
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
	render() {
		if (this.props.location.toString() !== this.last_location) {
			this.state.expanded = false;

			this.last_location = this.props.location.toString();
		}

		this.update();

		const ui_categories = [];

		for (let id in categories) {
			const { short } = categories[id];
			ui_categories.push(
				<Link
					key={id}
					to={`/games/category.html?id=${id}`}
					className="entry text"
				>
					<Obfuscated>{short}</Obfuscated>
				</Link>
			);
		}

		return (
			<>
				{super.render()}
				<ObfuscateLayout />
				<nav className="main" ref={this.nav}>
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
						to="/settings/general.html"
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
								route="/"
								name="Home"
								iconFilled={<Home />}
								iconOutlined={<HomeOutlined />}
								layout={this}
							/>
							<MainMenuTab
								route="/proxy.html"
								name="Proxy"
								iconFilled={<WebAsset />}
								layout={this}
							/>
							<MainMenuTab
								route="/faq.html"
								name="FAQ"
								iconFilled={<QuestionMark />}
								layout={this}
							/>

							<div className="bar" />

							<div className="title">
								<Obfuscated>Games</Obfuscated>
							</div>

							<MainMenuTab
								route="/games/popular.html"
								name="Popular"
								iconFilled={<SortRounded />}
								layout={this}
							/>
							<MainMenuTab
								route="/games/favorites.html"
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
								<Link to="/credits.html">Credits</Link>
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
				</div>
			</>
		);
	}
}

export default forwardRef((props, ref) => {
	return <MainLayout ref={ref} location={useLocation()} {...props} />;
});
