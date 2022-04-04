import ProxyModule from '../../ProxyModule.js';
import { RammerheadAPI, StrShuffler } from '../../RammerheadAPI.js';
import { rhApp } from '../../root.js';

export default class Rammerhead extends ProxyModule {
	api = new RammerheadAPI(rhApp);
	async _componentDidMount() {
		await this.possible_error('Unable to create a new Rammerhead session.');
		const session = await this.api.newsession();
		await this.possible_error();

		await this.possible_error('Unable to edit a Rammerhead session.');
		await this.api.editsession(session, false, true);
		await this.possible_error();

		await this.possible_error('Unable to retrieve shuffled dictionary.');
		const dict = await this.api.shuffleDict(session);
		await this.possible_error();

		const shuffler = new StrShuffler(dict);

		this.redirect(
			new URL(`${session}/${shuffler.shuffle(this.destination)}`, rhApp)
		);
	}
}
