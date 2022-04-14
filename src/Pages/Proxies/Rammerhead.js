import ProxyModule from '../../ProxyModule.js';
import { RammerheadAPI, StrShuffler } from '../../RammerheadAPI.js';
import { rhApp } from '../../root.js';

export default class Rammerhead extends ProxyModule {
	api = new RammerheadAPI(rhApp);
	/**
	 * @returns {string|undefined} value
	 */
	get session() {
		return localStorage.rammerhead_session;
	}
	/**
	 * @param {string} value
	 */
	set session(value) {
		localStorage.rammerhead_session = value;
		return value;
	}
	async _componentDidMount() {
		this.possible_error('Unable to check if the saved session exists.');
		if (!this.session || !(await this.api.sessionexists(this.session))) {
			await this.possible_error('Unable to create a new Rammerhead session.');
			const session = await this.api.newsession();
			await this.possible_error();
			this.session = session;
		}
		this.possible_error();

		await this.possible_error('Unable to edit a Rammerhead session.');
		await this.api.editsession(this.session, false, true);
		await this.possible_error();

		await this.possible_error('Unable to retrieve shuffled dictionary.');
		const dict = await this.api.shuffleDict(this.session);
		await this.possible_error();

		const shuffler = new StrShuffler(dict);

		this.redirect(
			new URL(`${this.session}/${shuffler.shuffle(this.destination)}`, rhApp)
		);
	}
}
