import { Component, createRef } from 'react';

export default class PlainSelect extends Component {
	options = [];
	container = createRef();
	constructor(props) {
		super(props);

		const options = [];

		for (let child of this.props.children) {
			if (child.type === 'option') {
				options.push({
					name: child.props.children,
					value: child.props.value,
				});
			}
		}

		this.state = {
			value: this.props.value || this.props.defaultValue,
			open: false,
			options,
		};
	}
	async set_value(value) {
		await this.setState({
			value,
			open: false,
		});

		this.container.current.value = this.state.value;

		if (typeof this.props.onChange === 'function') {
			this.props.onChange({ target: this.container.current });
		}
	}
	render() {
		const { className, onChange, ...attributes } = this.props;

		const list = [];

		for (let { name, value } of this.state.options) {
			const classes = ['plain-option'];

			if (value === this.state.last_select) {
				classes.push('hover');
			}

			list.push(
				<div
					className={classes.join(' ')}
					key={value}
					onClick={() => {
						this.set_value(value);
					}}
					onMouseOver={() => {
						this.setState({
							last_select: value,
						});
					}}
				>
					{name}
				</div>
			);
		}

		let active_option;

		for (let option of this.state.options) {
			if (option.value === this.state.value) {
				active_option = option;
				break;
			}
		}

		if (active_option === undefined) {
			active_option = this.state.options[0];
		}

		return (
			<div
				{...attributes}
				tabIndex="0"
				className={'plain-select' + (className ? ' ' + className : '')}
				data-open={Number(this.state.open)}
				ref={this.container}
				onKeyDown={event => {
					let prevent_default = true;

					switch (event.code) {
						case 'ArrowDown':
						case 'ArrowUp':
							{
								let last_i = 0;

								for (let i = 0; i < this.state.options.length; i++) {
									const { value } = this.state.options[i];

									if (value === this.state.last_select) {
										last_i = i;
										break;
									}
								}

								let next;

								switch (event.code) {
									case 'ArrowDown':
										if (last_i === this.state.options.length - 1) {
											next = this.state.options[0];
										} else {
											next = this.state.options[last_i + 1];
										}
										break;
									case 'ArrowUp':
										if (last_i === 0) {
											next = this.state.options[this.state.options.length - 1];
										} else {
											next = this.state.options[last_i - 1];
										}
										break;
									// no default
								}

								this.setState({
									last_select: next.value,
								});

								if (!this.state.open) {
									this.set_value(next.value);
								}
							}
							break;
						case 'Enter':
							if (this.state.open) {
								this.set_value(this.state.last_select);
							} else {
								this.setState({
									open: true,
								});
							}
							break;
						case 'Space':
							this.setState({
								open: true,
							});
							break;
						default:
							prevent_default = false;
							break;
						// no default
					}

					if (prevent_default) {
						event.preventDefault();
					}
				}}
			>
				<div
					className="toggle"
					onClick={async () => {
						this.setState({
							open: !this.state.open,
							last_select: this.state.value,
						});
						this.container.current.focus();
					}}
				>
					{active_option.name}
					<span className="material-icons">expand_more</span>
				</div>
				<div
					className="list"
					onMouseLeave={() => {
						this.setState({
							last_select: undefined,
						});
					}}
				>
					{list}
				</div>
			</div>
		);
	}
}
