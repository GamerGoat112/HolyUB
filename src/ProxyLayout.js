import Layout from './Layout.js';
import { ObfuscateComponent } from './obfuscate.js';
import { Outlet } from 'react-router-dom';

export default class ProxyLayout extends Layout {
	render() {
		super.update();

		return (
			<>
				<ObfuscateComponent />
				<Outlet />
			</>
		);
	}
}
