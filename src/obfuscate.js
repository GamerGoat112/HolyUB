import { Component, createRef } from 'react';
import { create } from 'random-seed';

const rand = create(navigator.userAgent + global.location.origin);

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let used_chars = '';

function unused_char() {
	while (true) {
		const char = chars[rand(chars.length)];

		if (used_chars.includes(char)) {
			continue;
		}

		used_chars += char;

		return char;
	}
}

function classes() {
	const classes = [];

	for (let i = 0; i < 7; i++) {
		classes.push(unused_char());
	}

	return classes;
}

const junk_classes = classes();
const real_classes = classes();
const ellipsis_classes = classes();

const char_class = unused_char();
const string_class = unused_char();

export class ObfuscateLayout extends Component {
	style = createRef();
	componentDidMount() {
		const { sheet } = this.style.current;

		for (let junk of junk_classes) {
			sheet.insertRule(
				`.${string_class} .${junk}{position:absolute;z-index:-10;opacity:0}`
			);
		}

		// word
		sheet.insertRule(`.${string_class}>span{display:inline-block}`);

		for (let ellipsis of ellipsis_classes) {
			sheet.insertRule(`.${string_class} .${ellipsis}{display:inline}`);
		}
	}
	render() {
		return <style ref={this.style}></style>;
	}
}

class ObfuscateContext {
	constructor(text) {
		this.rand = create(text + navigator.userAgent + global.location.origin);
	}
	ellipsis_class() {
		return ellipsis_classes[this.rand(ellipsis_classes.length)];
	}
	junk_class() {
		return junk_classes[this.rand(junk_classes.length)];
	}
	real_class() {
		return real_classes[this.rand(real_classes.length)];
	}
	random(chars, i, ci) {
		const r = this.rand(2);

		switch (r) {
			default:
				console.warn('Random for', r, 'not set...');
			// eslint-disable-next-line
			case 0:
				return (
					<span key={i} className={this.junk_class()}>
						{chars[chars.length - ci]}
					</span>
				);
			case 1:
				return (
					<span key={i} className={this.junk_class()}>
						{String.fromCharCode(chars[chars.length - ci - 1].charCodeAt() ^ i)}
					</span>
				);
		}
	}
}

/**
 *
 * @param {string} text
 * @param {boolean} ellipsis
 * @returns {JSX.Element}
 */
export function obfuscateText(text, ellipsis, key) {
	const context = new ObfuscateContext(text);

	const output = [];
	const words = text.split(' ');

	for (let wi = 0; wi < words.length; wi++) {
		const word = words[wi];
		const chars = word.split('');

		const added = [];

		for (let ci = 0; ci < chars.length; ci++) {
			const char = chars[ci];

			let content = [];

			const add_chars = context.rand.intBetween(1, 2);
			const real_at_i = context.rand(add_chars);

			for (let i = 0; i < add_chars; i++) {
				if (i === real_at_i) {
					content.push(
						<span key={`${wi}${ci}${i}`} className={context.real_class()}>
							{char}
						</span>
					);
				} else {
					content.push(context.random(chars, i, ci));
				}
			}

			added.push(
				<span key={`${wi}${ci}`} className={char_class}>
					{content}
				</span>
			);
		}

		let word_class;

		if (ellipsis) {
			word_class = context.ellipsis_class();
		}

		output.push(
			<span className={word_class} key={`${wi}`}>
				{added}
			</span>
		);

		if (wi !== words.length - 1) {
			output.push(' ');
		}
	}

	return (
		<span key={key} className={string_class}>
			{output}
		</span>
	);
}

/**
 * @description A obfuscated text block. This will strip the input of all non-text elements.d
 */
export function Obfuscated(props) {
	let string = '';
	const stack = [
		{
			props,
		},
	];

	let toclone;
	while ((toclone = stack.pop())) {
		if (typeof toclone === 'string') {
			string += toclone;
		} else if (typeof toclone === 'object' && toclone !== undefined) {
			let children = toclone.props.children;

			if (!(children instanceof Array)) {
				children = [children];
			}

			let max = children.length;
			for (let i = 0; i < max; i++) {
				// append in reverse order
				const child = children[max - i - 1];
				stack.push(child);
			}
		}
	}

	return obfuscateText(string, 'ellipsis' in props);
}

export function ObfuscatedA(props) {
	const { href, children, onClick, ...attributes } = props;

	return (
		// eslint-disable-next-line jsx-a11y/anchor-is-valid
		<a
			href="i:"
			{...attributes}
			onClick={event => {
				if (typeof onClick === 'function') {
					onClick(event);
				}

				event.preventDefault();
				window.open(href, '_self');
			}}
		>
			{children}
		</a>
	);
}
