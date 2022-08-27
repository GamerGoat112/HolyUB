import '../../styles/TheatreCategory.scss';
import type { HolyPage } from '../../App';
import TheatreCategory from '../../TheatreCategory';
import categories from '../../gameCategories';
import { useSearchParams } from 'react-router-dom';

const Apps: HolyPage = (props) => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id')!;
	const category = categories.find((category) => category.id === id);

	if (!category) return <>Bad category ID</>;

	return (
		<TheatreCategory
			{...props}
			name="Apps"
			id="apps"
			key="apps"
			category="app"
			placeholder="Search by app name"
		/>
	);
};

export default Apps;
