import { Obfuscated } from '../../obfuscate.js';
import engines from '../../engines.js';
import { ThemeSelect } from '../../ThemeElements.js';

export default function Search(props) {
	return (
		<>
			<label>
				<span>
					<Obfuscated>Proxy</Obfuscated>:
				</span>
				<ThemeSelect
					onChange={event =>
						props.layout.current.settings.set('proxy', event.target.value)
					}
					defaultValue={props.layout.current.settings.get('proxy')}
				>
					<option value="automatic">Automatic (Default)</option>
					<option value="ultraviolet">Ultraviolet</option>
					<option value="rammerhead">Rammerhead</option>
					<option value="stomp">Stomp</option>
				</ThemeSelect>
			</label>
			<label>
				<span>
					<Obfuscated>Search Engine</Obfuscated>:
				</span>
				<ThemeSelect
					onChange={event =>
						props.layout.current.settings.set('search', event.target.value)
					}
					defaultValue={props.layout.current.settings.get('search')}
				>
					{engines.map(({ name, format }) => (
						<option value={format}>{name}</option>
					))}
				</ThemeSelect>
			</label>
		</>
	);
}
