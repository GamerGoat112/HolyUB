import { Obfuscated } from '../../obfuscate.js';
import engines from '../../engines.js';
import PlainSelect from '../../PlainSelect.js';

export default function Search(props) {
	return (
		<>
			<label>
				<span>
					<Obfuscated>Proxy</Obfuscated>:
				</span>
				<PlainSelect
					onChange={event =>
						props.layout.current.settings.set('proxy', event.target.value)
					}
					defaultValue={props.layout.current.settings.get('proxy')}
				>
					<option value="automatic">Automatic (Default)</option>
					<option value="ultraviolet">Ultraviolet</option>
					<option value="rammerhead">Rammerhead</option>
					<option value="stomp">Stomp</option>
				</PlainSelect>
			</label>
			<label>
				<span>
					<Obfuscated>Search Engine</Obfuscated>:
				</span>
				<PlainSelect
					onChange={event =>
						props.layout.current.settings.set('search', event.target.value)
					}
					defaultValue={props.layout.current.settings.get('search')}
				>
					{engines.map(({ name, format }) => (
						<option value={format}>{name}</option>
					))}
				</PlainSelect>
			</label>
		</>
	);
}
