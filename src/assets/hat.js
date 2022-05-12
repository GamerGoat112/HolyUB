import process from 'process';
import { ReactComponent as HatDev } from './hat-dev.svg';
import { ReactComponent as HatBeta } from './hat-beta.svg';
import { ReactComponent as Hat } from './hat.svg';

export default function HatSVG(props) {
	const { children, ...attributes } = props;

	switch (process.env.REACT_APP_HAT_BADGE) {
		case 'DEV':
			return <HatDev {...attributes}>{children}</HatDev>;
		case 'BETA':
			return <HatBeta {...attributes}>{children}</HatBeta>;
		default:
			return <Hat {...attributes}>{children}</Hat>;
	}
}
