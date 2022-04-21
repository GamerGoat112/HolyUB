import Layout from './Layout.js';
import { ObfuscateLayout } from './obfuscate.js';
import { Outlet } from 'react-router-dom';

export default class ProxyLayout extends Layout {
	render() {
		super.update();

		return (
			<>
				<ObfuscateLayout />
				<Outlet />
			</>
		);
	}
}
