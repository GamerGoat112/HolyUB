import './styles/ThemeElements.scss';
import { ObfuscatedA } from './obfuscate';
import type { ObfuscatedAProps } from './obfuscate';
import { ExpandMore } from '@mui/icons-material';
import clsx from 'clsx';
import type {
	AnchorHTMLAttributes,
	PropsWithChildren,
	ReactElement,
	ReactNode,
} from 'react';
import { forwardRef, useState } from 'react';
import type { LinkProps } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function ThemeButton({
	children,
	className,
	...attributes
}: PropsWithChildren<{ className?: string }>) {
	return (
		<button
			type="button"
			className={clsx('theme-button', className)}
			{...attributes}
		>
			{children}
		</button>
	);
}

export function ThemeInputBar({
	children,
	className,
	...attributes
}: PropsWithChildren<{ className?: string }>) {
	return (
		<div className={clsx('theme-input-bar', className)} {...attributes}>
			{children}
		</div>
	);
}

export function ObfuscatedThemeA({
	children,
	className,
	...attributes
}: PropsWithChildren<{ className?: string } & ObfuscatedAProps>) {
	return (
		<ObfuscatedA className={clsx('theme-link', className)} {...attributes}>
			{children}
		</ObfuscatedA>
	);
}

export function ThemeA({
	children,
	className,
	...attributes
}: {
	className?: string;
	children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
	return (
		<a className={clsx('theme-link', className)} {...attributes}>
			{children}
		</a>
	);
}

export function ThemeLink({
	children,
	className,
	...attributes
}: PropsWithChildren<{ className?: string } & LinkProps>) {
	return (
		<Link className={clsx('theme-link', className)} {...attributes}>
			{children}
		</Link>
	);
}

export const ThemeInput = forwardRef<
	HTMLInputElement,
	PropsWithChildren<{ className?: string }>
>(function ThemeInput({ children, className, ...attributes }, ref) {
	return (
		<input ref={ref} className={clsx('theme-input', className)} {...attributes}>
			{children}
		</input>
	);
});

// <select ref={dummy_ref} forwardRef={ref}>

export function ThemeSelect({
	className,
	onChange,
	children,
	value,
	defaultValue,
	...attributes
}: {
	children?:
		| ReactElement<JSX.IntrinsicElements['option']>
		| ReactElement<JSX.IntrinsicElements['option']>[];
	className?: string;
	onChange?: (mockEvent: { target: HTMLInputElement }) => void;
	value?: string;
	defaultValue?: string;
}) {
	// ref target
	const [input, setInput] = useState<HTMLInputElement | null>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [lastSelect, setLastSelect] = useState(-1);
	const [open, setOpen] = useState(false);

	const list = [];

	interface Option {
		name: string;
		value: string;
		disabled: boolean;
	}

	const options: Option[] = [];
	const availableOptions: number[] = [];

	let defaultSelected = 0;

	if (!children) children = [];
	else if (!Array.isArray(children)) children = [children];

	for (const child of children) {
		if (child.type === 'option') {
			const option: Option = {
				name: child.props.children as string,
				value: child.props.value as string,
				disabled: child.props.disabled === true,
			};

			if (option.value === (value || defaultValue)) {
				defaultSelected = options.length;
			}

			if (!option.disabled) {
				availableOptions.push(options.length);
			}

			options.push(option);
		}
	}

	const [selected, _setSelected] = useState(defaultSelected);

	function setSelected(value: number) {
		_setSelected(value);
		setOpen(false);

		if (typeof onChange === 'function')
			setTimeout(() => onChange({ target: input! }));
	}

	for (let i = 0; i < options.length; i++) {
		const option = options[i];

		list.push(
			<div
				className={clsx(
					'plain-option',
					i === lastSelect && 'hover',
					option.disabled && 'disabled'
				)}
				key={i}
				onClick={() => {
					if (!option.disabled) {
						setSelected(i);
					}
				}}
				onMouseOver={() => {
					if (!option.disabled) {
						setLastSelect(i);
					}
				}}
			>
				{option.name}
			</div>
		);
	}

	return (
		<div
			{...attributes}
			tabIndex={0}
			className={clsx('theme-select', className)}
			data-open={Number(open)}
			ref={setContainer}
			onKeyDown={(event) => {
				let preventDefault = true;

				switch (event.code) {
					case 'ArrowDown':
					case 'ArrowUp':
						{
							const lastI = lastSelect;
							const lastIAvailable = availableOptions.indexOf(
								[...availableOptions].sort(
									(a, b) => Math.abs(a - lastI) - Math.abs(b - lastI)
								)[0]
							);

							let next;

							switch (event.code) {
								case 'ArrowDown':
									if (lastIAvailable === availableOptions.length - 1) {
										next = 0;
									} else {
										next = lastIAvailable + 1;
										if (options[lastI].disabled) {
											next--;
										}
									}
									break;
								case 'ArrowUp':
									if (lastIAvailable === 0) {
										next = availableOptions.length - 1;
									} else {
										next = lastIAvailable - 1;
										if (options[lastI].disabled) {
											next--;
										}
									}
									break;
								// no default
							}

							const nextI = availableOptions[next];

							setLastSelect(nextI);

							if (!open) setSelected(nextI);
						}
						break;
					case 'Enter':
						if (open) setSelected(lastSelect);
						else setOpen(true);
						break;
					case 'Space':
						setOpen(true);
						break;
					default:
						preventDefault = false;
						break;
					// no default
				}

				if (preventDefault) {
					event.preventDefault();
				}
			}}
			onBlur={(event) => {
				if (!event.target.contains(event.relatedTarget)) setOpen(false);
			}}
		>
			<input ref={setInput} value={options[selected]?.value} readOnly hidden />
			<div
				className="toggle"
				onClick={() => {
					setOpen(!open);
					setLastSelect(selected);
					container!.focus();
				}}
			>
				{options[selected]?.name}
				<ExpandMore />
			</div>
			<div
				className="list"
				onMouseLeave={() => {
					setLastSelect(-1);
				}}
			>
				{list}
			</div>
		</div>
	);
}
