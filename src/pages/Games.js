import { Component, createRef } from 'react';
import { set_page } from '../root.js';
import { Obfuscated } from '../obfuscate.js';
import data from '../games.json';
import '../styles/Games.scss';

class Item extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: this.props.name,
			id: this.props.id,
			target: this.props.target,
			src: this.props.src,
		};
	}
	open() {
		switch (this.props.target) {
			case 'proxy':
				this.props.layout.current.service_frame.current.proxy(
					this.state.src,
					this.state.name
				);
				break;
			case 'embed':
				this.props.layout.current.service_frame.current.embed(
					this.state.src,
					this.state.name
				);
				break;
			case 'webretro':
				this.props.layout.current.service_frame.current.embed(
					`/assets/theatre/WebRetro/?rom=${encodeURIComponent(
						this.state.src
					)}&core=autodetect`,
					this.state.name
				);
				break;
			default:
				throw new TypeError(`Unrecognized target: ${this.props.target}`);
		}
	}
	render() {
		const style = {
			backgroundPosition: `${this.state.id * data.image.width * -1}px`,
		};

		return (
			<div className="item" onClick={this.open.bind(this)}>
				<div className="front" style={style}></div>
				<div className="name">
					<Obfuscated>{this.state.name}</Obfuscated>
				</div>
			</div>
		);
	}
}

class Category extends Component {
	items = createRef();
	container = createRef();
	constructor(props) {
		super(props);

		this.state = {
			overflowing: false,
			expanded: false,
			id: this.props.id,
			name: this.props.name,
			items: this.props.items,
			base: this.props.base,
		};

		this.resize = this.resize.bind(this);
	}
	resize() {
		const { expanded } = this.container.current.dataset;
		this.container.current.dataset.expanded = 0;

		this.setState({
			overflowing:
				this.items.current.clientHeight < this.items.current.scrollHeight,
		});

		this.container.current.dataset.expanded = expanded;
	}
	componentDidMount() {
		this.resize();
		window.addEventListener('resize', this.resize);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize);
	}
	async expand() {
		await this.setState({
			expanded: !this.state.expanded,
		});
	}
	render() {
		const items = [];

		for (let i = 0; i < this.state.items.length; i++) {
			const item = this.state.items[i];

			items.push(
				<Item
					key={i}
					layout={this.state.layout}
					name={item.name}
					src={new URL(item.src, this.state.base)}
					target={item.target}
					id={item.id}
				/>
			);
		}

		return (
			<section
				data-overflowing={Number(this.state.overflowing)}
				data-expanded={Number(this.state.expanded)}
				id={this.state.id}
				ref={this.container}
			>
				<h1>{this.state.name}</h1>
				<div className="items" ref={this.items}>
					{items}
				</div>
				<div
					className="items-expand material-icons"
					onClick={this.expand.bind(this)}
				>
					{this.state.expanded ? 'expand_less' : 'expand_more'}
				</div>
			</section>
		);
	}
}

export default class Games extends Component {
	render() {
		set_page('games');

		const categories = [];

		for (let i = 0; i < data.categories.length; i++) {
			const category = data.categories[i];

			categories.push(
				<Category
					key={i}
					layout={this.props.layout}
					name={category.name}
					items={category.items}
					id={category.id}
					base={new URL(category.base, global.location)}
				/>
			);
		}

		return (
			<>
				<main>{categories}</main>
			</>
		);
	}
}
