/**
 * @typedef {object} Voucher
 * @property {string} tld
 */

/**
 * @typedef {object} RedeemedVoucher
 * @property {string} hash
 */

export default class VoucherAPI {
	/**
	 *
	 * @param {string} server
	 * @param {AbortSignal} [signal]
	 */
	constructor(server, signal) {
		this.server = server;
		this.signal = signal;
	}
	/**
	 *
	 * @param {string} url
	 * @param {object} init
	 * @returns
	 */
	async fetch(url, init = {}) {
		return await fetch(new URL(url, this.server), {
			...init,
			signal: this.signal,
		});
	}
	/**
	 *
	 * @param {string} voucher
	 * @param {AbortSignal} [signal]
	 * @returns {Voucher}
	 */
	async show_voucher(voucher) {
		const outgoing = await this.fetch(`./vouchers/${voucher}/`);

		if (!outgoing.ok) {
			throw (await outgoing.json()).error;
		}

		return await outgoing.json();
	}
	/**
	 *
	 * @param {string} voucher
	 * @returns {RedeemedVoucher}
	 */
	async redeem_voucher(voucher, domain) {
		/*const outgoing = await this.fetch(`./vouchers/${voucher}/`, {
			method: 'POST',
			body: JSON.stringify({ domain }),
		});*/
		const outgoing = await this.fetch(`./vouchers/${voucher}/${domain}`);

		if (!outgoing.ok) {
			throw (await outgoing.json()).error;
		}

		return await outgoing.json();
	}
}
