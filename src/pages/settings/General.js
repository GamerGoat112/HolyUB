import PlainSelect from '../../PlainSelect';
import { Obfuscated } from '../../obfuscate';

export default function General(props) {
	return (
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
	);
}
