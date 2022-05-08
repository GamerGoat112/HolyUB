/**
 * @typedef {object} Voucher
 * @property {string} tld
 */

/**
 * @typedef {object} RedeemedVoucher
 * @property {string} hash
 */

export default class VoucherAPI {
	constructor(server) {
		this.server = server;
	}
	/**
	 *
	 * @param {string} voucher
	 * @param {AbortSignal} [signal]
	 * @returns {Voucher}
	 */
	async show_voucher(voucher, signal) {
		const outgoing = await fetch(
			new URL(`./vouchers/${voucher}/`, this.server),
			{ signal }
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
	/**
	 *
	 * @param {string} voucher
	 * @param {AbortSignal} [signal]
	 * @returns {RedeemedVoucher}
	 */
	async redeem_voucher(voucher, domain, signal) {
		const outgoing = await fetch(
			new URL(`./vouchers/${voucher}/`, this.server),
			{ signal, method: 'POST', body: JSON.stringify({ domain }) }
		);

		if (!outgoing.ok) {
			throw await outgoing.json();
		}

		return await outgoing.json();
	}
}
