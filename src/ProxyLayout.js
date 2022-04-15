import Layout from './Layout.js';
import { ObfuscateStyle } from './obfuscate.js';
import { Outlet } from 'react-router-dom';

export default class ProxyLayout extends Layout {
	render() {
		super.update();

		return (
			<>
				<ObfuscateStyle />
				<Outlet />
			</>
		);
	}
}
