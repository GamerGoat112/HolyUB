import ProxyModule from '../../ProxyModule.js';
import { set_page } from '../../root.js';
import '../../styles/ProxyScript.scss';

export default class Flash extends ProxyModule {
	name = 'Flash';
	constructor(props) {
		super(props);

		this.state.ruffle_loaded = false;
	}
	async _componentDidMount() {
		await this.possible_error('Error loading Ruffle player.');
		await this.load_script('/ruffle/ruffle.js');
		await this.possible_error();

		const ruffle = global.RufflePlayer.newest();
		this.player = ruffle.createPlayer();
		this.move_player(document.body);

		this.player.addEventListener('loadeddata', () => {
			this.setState({
				ruffle_loaded: true,
			});
		});

		this.player.addEventListener('error', event => {
			console.log(event);
			this.setState({
				error: event.error,
			});
		});

		this.player?.load({ url: this.destination.toString() });
	}
	move_player(parent) {
		const inst = this.player.instance;
		this.player.instance = false;
		parent.append(this.player);
		this.player.instance = inst;
	}
	componentWillUnmount() {
		this.player.remove();
	}
	render() {
		set_page('proxy-script-flash');

		if (!this.state.error && this.state.ruffle_loaded) {
			return (
				<main
					data-ruffle="1"
					ref={main => {
						if (main === undefined) {
							this.player.remove();
						} else {
							this.move_player(main);
						}
					}}
				></main>
			);
		} else {
			return super.render();
		}
	}
}
