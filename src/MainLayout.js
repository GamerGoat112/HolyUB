import { ObfuscateLayout, Obfuscated } from './obfuscate.js';
import { ReactComponent as HatSVG } from './assets/hat-small.svg';
import { ReactComponent as WavesSVG } from './assets/waves.svg';
import { createRef } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Layout from './Layout.js';
import './styles/Navigation.scss';
import './styles/Footer.scss';

export default class MainLayout extends Layout {
	state = {
		...this.state,
		expanded: false,
	};
	nav = createRef();
	collapsable = createRef();
	listen_click(event) {
		if (this.collapsable.current.contains(event.target)) {
			this.setState({
				expanded: false,
			});
		}
	}
	constructor(props) {
		super(props);
		this.listen_click = this.listen_click.bind(this);
	}
	componentDidMount() {
		super.componentDidMount();
		document.addEventListener('click', this.listen_click);
	}
	componentWillUnmount() {
		super.componentWillUnmount();
		document.removeEventListener('click', this.listen_click);
	}
	render() {
		this.update();

		return (
			<>
				<ObfuscateLayout />
				<nav
					className="main"
					ref={this.nav}
					data-expanded={Number(this.state.expanded)}
				>
					<button
						tabIndex="0"
						className="expand"
						onClick={() => this.setState({ expanded: !this.state.expanded })}
					>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>
					<Link to="/" className="entry logo">
						<HatSVG />
					</Link>
					<div className="shift-right"></div>
					<div className="collapsable" ref={this.collapsable}>
						<Link to="/proxy.html" className="entry">
							<span>Proxy</span>
						</Link>
						<Link to="/games/popular.html" className="entry">
							<span>Games</span>
						</Link>
						<Link to="/faq.html" className="entry">
							<span>FAQ</span>
						</Link>
					</div>
					<Link to="/settings.html">
						<button>
							<span className="material-icons">settings</span>
						</button>
					</Link>
				</nav>
				{this.props.element || <Outlet />}
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
