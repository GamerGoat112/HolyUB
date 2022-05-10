import Layout from './Layout.js';
import { ObfuscateLayout } from './obfuscate.js';
import { Outlet } from 'react-router-dom';

export default class ProxyLayout extends Layout {
	render() {
		return (
			<>
				{super.render()}
				<ObfuscateLayout />
				<Outlet />
			</>
		);
	}
}
