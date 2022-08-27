import type { LayoutRef } from '../../Layout';
import { ThemeSelect } from '../../ThemeElements';
import engines from '../../engines';
import { Obfuscated } from '../../obfuscate';
import type { RefObject } from 'react';

const Search = ({ layout }: { layout: RefObject<LayoutRef> }) => {
	return (
		<section>
			<div>
				<span>
					<Obfuscated>Proxy</Obfuscated>:
				</span>
				<ThemeSelect
					onChange={(event) =>
						layout.current!.setSettings({
							...layout.current!.settings,
							proxy: event.target.value,
						})
					}
					defaultValue={layout.current!.settings.proxy}
				>
					<option value="automatic">Automatic (Default)</option>
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
					onChange={(event) =>
						layout.current!.setSettings({
							...layout.current!.settings,
							search: event.target.value,
						})
					}
					defaultValue={layout.current!.settings.search}
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
};

export default Search;
