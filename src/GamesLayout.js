import { Outlet, Link, useNavigate } from 'react-router-dom';
import { createRef, forwardRef } from 'react';
import { Obfuscated, ObfuscateLayout } from './obfuscate.js';
import { DB_API, get_page, set_page } from './root.js';
import { GamesAPI } from './GamesCommon.js';
import categories from './pages/games/categories.json';
import Settings from './Settings.js';
import Layout from './Layout.js';
import './styles/Games.scss';
import './styles/Navigation.scss';

class GamesLayout extends Layout {
	menu = createRef();
	input = createRef();
	expand = createRef();
	state = {
		...this.state,
		expanded: false,
	};
	abort = new AbortController();

	update() {
		super.update();
		document.documentElement.dataset.expanded = Number(this.state.expanded);
	}
	render() {
		this.update();

		if (!get_page()?.startsWith('games-')) {
			set_page('games');
		}

		const ui_categories = [];

		for (let id in categories) {
			const { name } = categories[id];
			ui_categories.push(
				<Link
					onClick={() => this.setState({ expanded: false })}
					key={id}
					to={`/games/category.html?id=${id}`}
					className="entry text"
				>
					<span>
						<Obfuscated>{name}</Obfuscated>
					</span>
				</Link>
			);
		}

		return (
			<>
				{super.render()}
				<ObfuscateLayout />
				<nav className="games" data-expanded={Number(this.state.expanded)}>
					<button
						tabIndex="0"
						className="expand"
						ref={this.expand}
						onClick={async () => {
							await this.setState({
								expanded: !this.state.expanded,
							});

							if (this.state.expanded) {
								this.menu.current.focus();
								this.menu.current.scrollIntoView({
									block: 'start',
								});
							}
						}}
					>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>

					<div className="shift-right" />
					<Link to="/settings/general.html">
						<button>
							<span className="material-icons">settings</span>
						</button>
					</Link>
				</nav>
				<Outlet />
			</>
		);
	}
}

const GamesLayoutWrapper = forwardRef((props, ref) => {
	const navigate = useNavigate();
	return <GamesLayout ref={ref} {...props} navigate={navigate} />;
});

export default GamesLayoutWrapper;
