import CompatModule from '../../CompatModule.js';
import { set_page } from '../../root.js';

export default class Flash extends CompatModule {
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
		this.move_player(this.container.current);

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

		this.player.load({ url: this.destination.toString() });
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
		let render;

		if (!this.state.error && this.state.ruffle_loaded) {
			render = (
				<main
					data-ruffle="1"
					ref={main => {
						this.container.current = main;
						if (main === undefined) {
							this.player.remove();
						} else {
							this.move_player(main);
						}
					}}
				></main>
			);
		} else {
			render = super.render();
		}

		set_page('compat-flash');

		return render;
	}
}
