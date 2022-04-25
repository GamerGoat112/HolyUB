import { Component, createRef } from 'react';

class PlainOption extends Component {
	render() {
		const { children, select, value } = this.props;

		return (
			<div className={'plain-option'} onClick={() => select.set_value(value)}>
				{children}
			</div>
		);
	}
}

export default class PlainSelect extends Component {
	options = [];
	container = createRef();
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.value || this.props.defaultValue,
			open: false,
		};
	}
	async set_value(value) {
		await this.setState({
			value,
			open: false,
		});

		this.container.current.value = this.state.value;
		this.container.current.dispatchEvent(new Event('change'));
	}
	render() {
		const { children, className, onChange, ...attributes } = this.props;

		const options = [];

		for (let child of children) {
			if (child.type === 'option') {
				options.push({
					name: child.props.children,
					value: child.props.value,
				});
			}
		}

		const list = [];

		for (let { name, value } of options) {
			list.push(
				<PlainOption key={value} value={value} select={this}>
					{name}
				</PlainOption>
			);
		}

		let active_option;

		for (let option of options) {
			if (option.value === this.state.value) {
				active_option = option;
				break;
			}
		}

		return (
			<div
				{...attributes}
				tabIndex="0"
				className={'plain-select' + (className ? ' ' + className : '')}
				data-open={Number(this.state.open)}
				ref={container => {
					this.container.current = container;

					if (container !== null && typeof onChange === 'function') {
						container.addEventListener('change', onChange);
					}
				}}
			>
				<div
					className="toggle"
					onClick={async () => {
						this.setState({ open: !this.state.open });
						this.container.current.focus();
					}}
				>
					{active_option.name}
					<span className="material-icons">expand_more</span>
				</div>
				<div className="list">{list}</div>
			</div>
		);
	}
}
