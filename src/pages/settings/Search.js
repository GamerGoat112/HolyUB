import { Obfuscated } from '../../obfuscate.js';
import { ThemeSelect } from '../../ThemeElements.js';
import engines from '../../engines.js';

export default function Search(props) {
	return (
		<section>
			<div>
				<span>
					<Obfuscated>Proxy</Obfuscated>:
				</span>
				<ThemeSelect
					onChange={event =>
						props.layout.current.settings.set('proxy', event.target.value)
					}
					defaultValue={props.layout.current.settings.get('proxy')}
				>
					<option value="automatic" disabled>
						Automatic (Default)
					</option>
					<option value="ultraviolet">Ultraviolet</option>
					<option value="rammerhead">Rammerhead</option>
					<option value="stomp">Stomp</option>
				</ThemeSelect>
			</div>
			<div>
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
						<option key={format} value={format}>
							{name}
						</option>
					))}
				</ThemeSelect>
			</div>
		</section>
	);
}
