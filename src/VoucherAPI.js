/**
 * @typedef {object} Voucher
 * @property {string} tld
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
}
