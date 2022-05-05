import { Component } from 'react';
import { Obfuscated } from '../obfuscate.js';
import PlainSelect from '../PlainSelect.js';
import { set_page } from '../root.js';

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
				<label>
					Theme:
					<PlainSelect
						defaultValue={this.layout.current.settings.get('theme')}
						onChange={event => {
							this.layout.current.settings.set('theme', event.target.value);
						}}
					>
						<option value="day">Day</option>
						<option value="night">Night</option>
					</PlainSelect>
				</label>
				<label>
					<Obfuscated>Proxy</Obfuscated>:
					<PlainSelect
						onChange={event =>
							this.layout.current.settings.set('proxy', event.target.value)
						}
						defaultValue={this.layout.current.settings.get('proxy')}
					>
						<option value="automatic">Automatic (Default)</option>
						<option value="ultraviolet">Ultraviolet</option>
						<option value="rammerhead">Rammerhead</option>
						<option value="stomp">Stomp</option>
					</PlainSelect>
				</label>
			</main>
		);
	}
}
