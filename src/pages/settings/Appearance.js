import { ThemeSelect } from '../../ThemeElements.js';

export default function Appearance(props) {
	return (
		<section>
			<div>
				<span>Theme:</span>
				<ThemeSelect
					defaultValue={props.layout.current.settings.get('theme')}
					onChange={event => {
						props.layout.current.settings.set('theme', event.target.value);
					}}
				>
					<option value="day">Day</option>
					<option value="night">Night</option>
				</ThemeSelect>
			</div>
		</section>
	);
}
