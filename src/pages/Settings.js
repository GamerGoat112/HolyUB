import { Brush, Home, HomeOutlined, Tab } from '@mui/icons-material';
import { Component } from 'react';
import { Outlet } from 'react-router-dom';
import { MenuTab } from '../MainLayout.js';
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
			<>
				<div className="page-menu menu-like">
					<MenuTab
						route="/settings/general.html"
						name="General"
						iconFilled={<Home />}
						iconOutlined={<HomeOutlined />}
					/>
					<MenuTab
						route="/settings/appearance.html"
						name="Appearance"
						iconFilled={<Brush />}
					/>
					<MenuTab
						route="/settings/tabcloak.html"
						name="Tab Cloak"
						iconFilled={<Tab />}
					/>
				</div>
				<main>
					<Outlet />
				</main>
			</>
		);
	}
}
