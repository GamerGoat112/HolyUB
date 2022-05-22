'use strict';

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const command_prefix = 'obfuscation:';

function loader(code) {
	const tree = parse(code, {
		allowAwaitOutsideFunction: true,
		allowImportExportEverywhere: true,
		allowReturnOutsideFunction: true,
		attachComment: true,
	});

	const strings = new Map();
	const strings_array = [];
	const call = t.identifier('$CALL_string');

	/**
	 * @param {string} string
	 * @returns {t.Node}
	 */
	function append_string(string) {
		if (!strings.has(string)) {
			const i = strings_array.length;
			strings_array.push(string);
			strings.set(string, i);
		}

		return t.callExpression(call, [t.numericLiteral(strings.get(string))]);
	}

	// `${x}str` => x+call()
	// 2:
	// `${x}str` => `${x}${call()}`

	// const { test } =
	// const { [call()]: test } =

	// console.log(JSON.stringify(tree));

	const skip_obfuscation = [];

	let skip_building;
	for (let comment of tree.comments) {
		const trimmed = comment.value.trim();

		if (trimmed.startsWith(command_prefix)) {
			const command = trimmed.slice(command_prefix.length);

			if (command === 'disable') {
				const loc = { start: comment.end };
				skip_building = loc;
				skip_obfuscation.push(loc);
			} else if (command === 'enable') {
				if (!skip_building) {
					console.warn('Unmatched :disable command');
				} else {
					skip_building.end = comment.start;
				}
			}
		}
	}

	function will_skip(path) {
		for (let { start, end } of skip_obfuscation) {
			if (start < path.node.start && end > path.node.start) {
				return true;
			}
		}

		return false;
	}

	traverse(tree, {
		ImportDeclaration(path) {
			path.skip();
		},
		Import(path) {
			path.skip();
		},
		TemplateLiteral(path) {
			if (will_skip(path)) return;

			const quasis = [];
			const expressions = [];

			const node_expressions = [...path.node.expressions];

			for (let element of path.node.quasis) {
				if (element.value.raw) {
					expressions.push(append_string(element.value.raw));
					quasis.push(t.templateElement({ raw: '' }, false));
				}

				if (!element.tail) {
					expressions.push(node_expressions.pop());
					quasis.push(t.templateElement({ raw: '' }, false));
				}
			}

			quasis.push(t.templateElement({ raw: '' }, true));

			path.replaceWith(t.templateLiteral(quasis, expressions));
			path.skip();
		},
		Property(path) {
			if (will_skip(path)) return;

			let key;

			if (t.isIdentifier(path.node.key)) {
				key = path.node.key.name;
			} else if (t.isStringLiteral(path.node.key)) {
				key = path.node.key.value;
			}

			if (key !== undefined) {
				path.replaceWith(
					t.objectProperty(
						append_string(key),
						path.node.value,
						true,
						path.node.shorthand,
						path.node.decorators
					)
				);
			}
		},
		StringLiteral(path) {
			if (will_skip(path)) return;

			/*console.log(
				'!',
				generate(path.parentPath.parentPath.parentPath.node).code,
				'!',
				generate(path.parentPath.node).code,
				'!',
				generate(path.node).code,
				'!',
				path.parentKey
			);*/
			path.replaceWith(append_string(path.node.value));
		},
	});

	{
		const strings_id = t.identifier('$CALL_strings');
		const index_var = t.identifier('i');

		tree.program.body.unshift(
			t.variableDeclaration('const', [
				t.variableDeclarator(
					strings_id,
					t.arrayExpression(
						strings_array.map(string => t.stringLiteral(string))
					)
				),
			]),
			t.functionDeclaration(
				call,
				[index_var],
				t.blockStatement([
					t.returnStatement(t.memberExpression(strings_id, index_var, true)),
				])
			)
		);
	}

	return generate(tree).code;
}

function time(call) {
	return function (...args) {
		const name = call.name + ' ' + Math.random();
		console.time(name);
		const result = call.call(this, ...args);
		console.timeEnd(name);
		return result;
	};
}

module.exports = loader;
