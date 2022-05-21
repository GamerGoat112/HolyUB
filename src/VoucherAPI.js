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
	async show(voucher) {
		const outgoing = await this.fetch(`./vouchers/${voucher}/`);

		const json = await outgoing.json();

		if (!outgoing.ok) {
			throw new Error(json.message || json.error);
		}

		return json;
	}
	/**
	 *
	 * @param {string} voucher
	 * @returns {RedeemedVoucher}
	 */
	async redeem(voucher, domain) {
		const outgoing = await this.fetch(`./vouchers/${voucher}/`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ domain }),
		});

		const json = await outgoing.json();

		if (!outgoing.ok) {
			throw new Error(json.message || json.error);
		}

		return json;
	}
}
