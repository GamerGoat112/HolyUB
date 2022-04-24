import { Component } from 'react';

class PlainOption extends Component {
	constructor(props) {
		super(props);

		const { children, select, value, className, onClick, ...attributes } =
			this.props;

		this.select = select;
		this.value = value;
		this.onClick = onClick;
		this.attributes = attributes;
		this.className = className;
	}
	render() {
		return (
			<div
				className={
					'plain-option' + (this.className ? ' ' + this.className : '')
				}
				onClick={event => {
					if (typeof this.onClick === 'function') {
						this.onClick(event);
					}
				}}
				{...this.attributes}
			>
				{this.children}
			</div>
		);
	}
}

export default class PlainSelect extends Component {
	options = [];
	state = {};
	render() {
		const { children, defaultValue, className, onClick, ...attributes } =
			this.props;

		const options = [];

		for (let child of children) {
			if (child.type === 'option') {
				options.push(
					<PlainOption select={this} {...child.attributes}>
						{child.children}
					</PlainOption>
				);
			}
		}

		let active_option;

		for (let option in options) {
			if (option.value === this.state.value) {
				active_option = option;
			}
		}

		return (
			<div
				className={'plain-select' + (className ? ' ' + className : '')}
				onClick={event => {
					if (typeof onClick === 'function') {
						onClick(event);
					}
				}}
				{...attributes}
			>
				<div className="active-plain-option">{active_option}</div>
				<div className="plain-options"></div>
			</div>
		);
	}
}
