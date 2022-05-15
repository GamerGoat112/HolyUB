import { useRef } from 'react';

const unset = Symbol();

export default function useRefDefault(set) {
	const ref = useRef(unset);

	if (ref.current === unset) {
		ref.current = set();
	}

	return ref;
}
