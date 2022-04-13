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

const char_class = unused_char();
const string_class = unused_char();

export class ObfuscateStyle extends Component {
	style = createRef();
	componentDidMount() {
		const { sheet } = this.style.current;

		const junk_selector = [];

		for (let junk of junk_classes) {
			junk_selector.push(`.${string_class} .${junk}`);
		}

		sheet.insertRule(
			`${junk_selector.join(',')}{position:absolute;z-index:-10;opacity:0}`
		);
		sheet.insertRule(
			`.${string_class},.${string_class} s{text-decoration:none;flex:none;display:inline}`
		);
		sheet.insertRule(`.${string_class}>s{display:inline-block}`);
	}
	render() {
		return <style ref={this.style}></style>;
	}
}

class ObfuscateContext {
	constructor(text) {
		this.rand = create(text + navigator.userAgent + global.location.origin);
	}
	junk_class(rand) {
		return junk_classes[this.rand(junk_classes.length)];
	}
	real_class(rand) {
		return real_classes[this.rand(real_classes.length)];
	}
	random(chars, char, i, ci) {
		const r = this.rand(2);

		switch (r) {
			default:
				console.warn('Random for', r, 'not set...');
			// eslint-disable-next-line
			case 0:
				return (
					<s key={i} className={this.junk_class()}>
						{chars[chars.length - ci]}
					</s>
				);
			case 1:
				return (
					<s key={i} className={this.junk_class()}>
						{String.fromCharCode(chars[chars.length - ci - 1].charCodeAt() ^ i)}
					</s>
				);
		}
	}
}

/**
 * @param {JSX.Element} input Text to be obfuscate
 * @returns {JSX.Element} Obfuscated
 */
export default function obfuscate(input) {
	const text = input.props.children;
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
						<s key={`${wi}${ci}${i}`} className={context.real_class()}>
							{char}
						</s>
					);
				} else {
					content.push(context.random(chars, char, i, ci));
				}
			}

			added.push(
				<s key={`${wi}${ci}`} className={char_class}>
					{content}
				</s>
			);
		}

		output.push(<s key={`${wi}`}>{added}</s>);

		if (wi !== words.length - 1) {
			output.push(' ');
		}
	}

	return <s className={string_class}>{output}</s>;
}
