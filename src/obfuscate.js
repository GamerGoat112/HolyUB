import React, { Component, createRef } from 'react';
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

export class ObfuscateComponent extends Component {
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
function _obfuscate(text, ellipsis, key) {
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

			const add_chars = context.rand.intBetween(1, 4);
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
 * @param {JSX.Element} input Text to be obfuscate
 * @returns {JSX.Element} Obfuscated
 */
export function obfuscateEllipsis(input) {
	return _obfuscate(input.props.children, true);
}

/**
 * @param {JSX.Element} input JSX to be obfuscate
 * @returns {JSX.Element} Obfuscated
 */
export default function obfuscate(input) {
	/**
	 * @type {JSX.Element}
	 */
	const clone = [];

	/**
	 * @typedef {['iterate'|'finalize',...([JSX.Element,JSX.Element[]]|[function])][]} ObfuscatedStack
	 */

	/**
	 * @type {ObfuscatedStack}
	 */
	const stack = [['iterate', input, clone, 1]];

	let array;
	while ((array = stack.pop())) {
		const [instruction] = array.splice(0, 1);

		switch (instruction) {
			case 'iterate':
				const [toclone, list, i] = array;

				if (typeof toclone === 'string') {
					list.push(_obfuscate(toclone, false, i));
				} else if (typeof toclone === 'object' && toclone !== undefined) {
					const child_list = [];

					const props = {
						key: i,
					};

					for (let key in toclone.props) {
						if (key !== 'children') {
							props[key] = toclone.props[key];
						}
					}

					let children = toclone.props.children;

					if (!(children instanceof Array)) {
						children = [children];
					}

					let max = children.length;
					for (let i = 0; i < max; i++) {
						// append in reverse order
						const child = children[max - i - 1];
						stack.push(['iterate', child, child_list, i]);
					}

					stack.push([
						'finalize',
						() => {
							list.push(React.createElement(toclone.type, props, child_list));
						},
					]);
				}
				break;
			case 'finalize':
				const [callback] = array;

				// LAZY
				callback();
				break;
			default:
				console.warn('unknown instruction', instruction);
				break;
		}
	}

	return <>{clone}</>;
}

export class ObfuscatedA extends Component {
	render() {
		const props = { ...this.props };
		delete props.href;

		return (
			// eslint-disable-next-line jsx-a11y/anchor-is-valid
			<a
				href="i:"
				{...props}
				onClick={event => {
					event.preventDefault();
					window.open(this.props.href, '_self');
				}}
			>
				{this.props.children}
			</a>
		);
	}
}
