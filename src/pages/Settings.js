import { Component } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Obfuscated } from '../obfuscate.js';
import { set_page } from '../root.js';
import '../styles/Settings.scss';

export default class Settings extends Component {
	/**
	 * @returns {import('react').RefObject<import('../MainLayout.js').default>}
	 */
	get layout() {
		return this.props.layout;
	}
	render() {
		set_page('settings');

		return (
			<main>
				<div className="menu">
					<Link to="/settings/general.html">
						<div className="navigate">
							<span className="material-icons">home</span>
							<div className="name">
								<Obfuscated>General</Obfuscated>
							</div>
						</div>
					</Link>
					<Link to="/settings/appearance.html">
						<div className="navigate">
							<span className="material-icons">brush</span>
							<div className="name">
								<Obfuscated>Appearance</Obfuscated>
							</div>
						</div>
					</Link>
					<Link to="/settings/tabcloak.html">
						<div className="navigate">
							<span className="material-icons">tab</span>
							<div className="name">
								<Obfuscated>Tab Cloak</Obfuscated>
							</div>
						</div>
					</Link>
				</div>
				<div className="content">
					<Outlet />
				</div>
			</main>
		);
	}
}
