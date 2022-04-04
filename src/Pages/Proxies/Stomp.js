import ProxyModule from '../../ProxyModule.js';
import process from 'process';
import { bareCDN } from '../../root.js';

export default class Stomp extends ProxyModule {
	async _componentDidMount() {
		await this.load_script('/stomp/bootstrapper.js');

		const { StompBoot } = global;

		const config = {
			bare: bareCDN,
			directory: '/stomp/',
		};

		if (process.env.NODE_ENV === 'development') {
			config.loglevel = StompBoot.LOG_TRACE;
			config.codec = StompBoot.CODEC_PLAIN;
		} else {
			config.loglevel = StompBoot.LOG_ERROR;
			config.codec = StompBoot.CODEC_XOR;
		}

		this.boot = new StompBoot(config);

		await this.boot.ready;

		this.redirect(this.boot.html(this.destination));
	}
}
