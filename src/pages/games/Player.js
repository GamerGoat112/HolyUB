import { Component } from 'react';
import { set_page } from '../../root.js';
import '../../styles/Games Player.scss';

export class GamesPlayer extends Component {
	/**
	 * @returns {import('../Layout.js').default}
	 */
	get layout() {
		return this.props.layout.current;
	}
	render() {
		set_page('games-player');
		return <main></main>;
	}
}
