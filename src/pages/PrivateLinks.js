import { Component, createRef } from 'react';
import { ObfuscatedA } from '../obfuscate.js';
import { set_page, VOUCHER_URL, VO_API } from '../root.js';
import VoucherAPI from '../VoucherAPI.js';
import '../styles/PrivateLinks.scss';

export default class PrivateLinks extends Component {
	voucher = createRef();
	domain = createRef();
	api = new VoucherAPI(VO_API);
	constructor(props) {
		super(props);

		this.state = {};
	}
	render() {
		set_page('private-links');

		return (
			<main>
				<p>
					To use this service, you will need a voucher. Purchase a voucher{' '}
					<ObfuscatedA href={VOUCHER_URL}>here</ObfuscatedA>.
				</p>
				<form
					onSubmit={event => {
						event.preventDefault();
					}}
					className="redeem"
				>
					<input
						onChange={async () => {
							if (this.abort) {
								this.abort.abort();
							}

							this.abort = new AbortController();

							try {
								const { tld } = await this.api.show_voucher(
									this.voucher.current.value,
									this.abort.signal
								);

								this.setState({
									tld,
								});
							} catch (error) {
								if (error.message !== 'The user aborted a request.') {
									console.error(error);

									this.setState({
										error,
									});
								}
							}
						}}
						ref={this.voucher}
						placeholder="Voucher"
						className="voucher"
					></input>
					<div className="domain">
						<input placeholder="Domain" ref={this.domain}></input>
						<div className="tld">{this.state.tld || '.com'}</div>
					</div>
					<button type="submit">Redeem</button>
					<div className="error">
						{this.state.error !== undefined && this.state.error.toString()}
					</div>
				</form>
			</main>
		);
	}
}
