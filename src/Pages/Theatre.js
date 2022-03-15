import { Component, createRef } from 'react';
import root from '../root.js';
import data from '../theatre.json';
import obfuscate from '../obfuscate.js';

class Item extends Component {
	constructor(props){
		super(props);

		this.state = {
			name: this.props.name,
			image: this.props.image,
			target: this.props.target,
			src: this.props.src,
		}
	}
	open(){
		switch(this.props.target){
			case'proxy':
				this.props.layout.current.service_frame.current.proxy(this.state.src, this.state.name);
				break;
			case'embed':
				this.props.layout.current.service_frame.current.embed(this.state.src, this.state.name);
				break;
			case'webretro.mgba':
				this.props.layout.current.service_frame.current.embed(`/assets/theatre/WebRetro/?rom=${encodeURIComponent(this.state.src)}&core=mgba`, this.state.name);
				break;
			case'webretro.mupen64plus_next':
				this.props.layout.current.service_frame.current.embed(`/assets/theatre/WebRetro/?rom=${encodeURIComponent(this.state.src)}&core=mupen64plus_next`, this.state.name);
				break;
			case'webretro.snes9x':
				this.props.layout.current.service_frame.current.embed(`/assets/theatre/WebRetro/?rom=${encodeURIComponent(this.state.src)}&core=snes9x`, this.state.name);
				break;
			case'webretro.autodetect':
				this.props.layout.current.service_frame.current.embed(`/assets/theatre/WebRetro/?rom=${encodeURIComponent(this.state.src)}&core=autodetect`, this.state.name);
				break;
			default:
				throw new TypeError(`Unrecognized target: ${this.props.target}`)
		}
	}
	render(){
		const style = {
			backgroundPosition:`${this.state.image[0] * data.image.width * -1}px ${this.state.image[1] * data.image.height * -1}px`
		};
		
		return (
			<div className='item' onClick={this.open.bind(this)}>
				<div className='front' style={style}></div>
				<div className='name'>{obfuscate(<>{this.state.name}</>)}</div>
			</div>
		);	
	}
};

class Category extends Component {
	items = createRef();
	container = createRef();
	constructor(props){
		super(props);

		this.state = {
			overflowing: false,
			expanded: false,
			name: this.props.name,
			items: this.props.items,
			base: this.props.base,
		};

		this.resize = this.resize.bind(this);
	}
	resize(){
		this.setState({
			overflowing: this.overflowing,
		});
	}
	componentDidMount(){
		this.resize();
		window.addEventListener('resize', this.resize);
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.resize);
	}
	get overflowing(){
		const { expanded } = this.container.current.dataset;

		this.container.current.dataset.expanded = '0';

		const overflowing = this.items.current.clientHeight < this.items.current.scrollHeight;

		this.container.current.dataset.expanded = expanded;

		return overflowing;
	}
	async expand(){
		await this.setState({
			expanded: !this.state.expanded,
		});

		this.container.current.scrollIntoView({
			block: 'start',
		});
	}
	render(){
		const items = [];

		for(let i = 0; i < this.state.items.length; i++){
			const item = this.state.items[i];

			items.push(<Item key={i} layout={this.props.layout} name={item.name} src={new URL(item.src, this.state.base)} target={item.target} image={item.image} />)
		}

		return (
			<section data-overflowing={Number(this.state.overflowing)} data-expanded={Number(this.state.expanded)} ref={this.container}>
				<h1>{this.state.name}</h1>
				<div className='items' ref={this.items}>{items}</div>
				<div className='items-expand material-icons' onClick={this.expand.bind(this)}>{this.state.expanded ? 'expand_more' : 'expand_less'}</div>
			</section>
		)
	}
};

export default class Theatre extends Component {
	render(){
		root.dataset.page = 'theatre';
		
		const categories = [];

		for(let i = 0; i < data.categories.length; i++){
			const category = data.categories[i];

			categories.push(<Category key={i} layout={this.props.layout} name={category.name} items={category.items} base={new URL(category.base, global.location)} />);
		}

		return (
			<main>
				{categories}
			</main>
		);
	}
};