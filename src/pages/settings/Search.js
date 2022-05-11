import PlainSelect from '../../PlainSelect.js';
import { Obfuscated } from '../../obfuscate.js';

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
					<option value="https://www.google.com/search?q=%s">Google</option>
					<option value="https://duckduckgo.com/?q=%s">DuckDuckGo</option>
					<option value="https://www.bing.com/search?q=%s">Bing</option>
					<option value="https://en.wikipedia.org/wiki/Special:Search?search=%s">
						Wikipedia
					</option>
				</PlainSelect>
			</label>
		</>
	);
}
