import { Component, createRef } from 'react';
import { set_page } from '../root.js';
import { Obfuscated } from '../obfuscate.js';
import data from '../games.json';
import '../styles/Games.scss';

const games_base = new URL(data.base, global.location);

class Item extends Component {
	get layout(){
		return this.props.layout.current;
	}
	get service_frame(){
		return this.layout.service_frame.current;
	}
	open() {
		switch (this.props.target) {
			case 'proxy':
				this.service_frame.proxy(
					this.props.src,
					this.props.name
				);
				break;
			case 'embed':
				this.service_frame.embed(
					this.props.src,
					this.props.name
				);
				break;
			case 'webretro':
				this.service_frame.embed(
					`/assets/theatre/WebRetro/?rom=${encodeURIComponent(
						this.props.src
					)}&core=autodetect`,
					this.props.name
				);
				break;
			default:
				throw new TypeError(`Unrecognized target: ${this.props.target}`);
		}
	}
	render() {
		const style = {
			backgroundPosition: `${this.props.index * data.image.width * -1}px 0px`,
		};

		return (
			<div className="item" onClick={this.open.bind(this)}>
				<div className="front" style={style}></div>
				<div className="name">
					<Obfuscated>{this.props.name}</Obfuscated>
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
			load_image: false,
			overflowing: false,
			expanded: false,
		};

		this.scroll = this.scroll.bind(this);
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
	scroll(){
		const rect = this.container.current.getBoundingClientRect();
		const visible = rect.top < window.innerHeight && rect.bottom >= 0;
		
		// lazy loading
		if(visible){
			this.setState({
				load_image: true,
			});

			document.removeEventListener('scroll', this.scroll);
		}
	}
	componentDidMount() {
		document.addEventListener('scroll', this.scroll);
		window.addEventListener('resize', this.resize);

		this.resize();
		this.scroll();
	}
	componentWillUnmount() {
		document.removeEventListener('scroll', this.scroll);
		window.removeEventListener('resize', this.resize);
	}
	async expand() {
		await this.setState({
			expanded: !this.state.expanded,
		});
	}
	render() {
		const items = [];

		for (let i = 0; i < this.props.items.length; i++) {
			const item = this.props.items[i];

			items.push(
				<Item
					key={i}
					index={i}
					layout={this.props.layout}
					name={item.name}
					src={new URL(item.src, this.props.base)}
					target={item.target}
				/>
			);
		}

		return (
			<section
				data-load-image={Number(this.state.load_image)}
				data-overflowing={Number(this.state.overflowing)}
				data-expanded={Number(this.state.expanded)}
				id={this.props.id}
				ref={this.container}
			>
				<h1>{this.props.name}</h1>
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
					base={new URL(category.base, games_base)}
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
