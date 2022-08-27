import type { LayoutRef } from '../../Layout';
import { ThemeSelect } from '../../ThemeElements';
import type { RefObject } from 'react';

const Appearance = ({ layout }: { layout: RefObject<LayoutRef> }) => {
	return (
		<section>
			<div>
				<span>Theme:</span>
				<ThemeSelect
					defaultValue={layout.current!.settings.theme}
					onChange={(event) => {
						layout.current!.setSettings({
							...layout.current!.settings,
							theme: event.target.value,
						});
					}}
				>
					<option value="day">Day</option>
					<option value="night">Night</option>
				</ThemeSelect>
			</div>
		</section>
	);
};

export default Appearance;
