import DatabaseAPI from './DatabaseAPI.js';

/**
 * @typedef {object} Voucher
 * @property {string} tld
 */

/**
 * @typedef {object} RedeemedVoucher
 * @property {string} hash
 */

export default class VoucherAPI extends DatabaseAPI {
	/**
	 *
	 * @param {string} voucher
	 * @returns {Voucher}
	 */
	async show(voucher) {
		return await this.fetch(`./vouchers/${voucher}/`);
	}
	/**
	 *
	 * @param {string} voucher
	 * @returns {RedeemedVoucher}
	 */
	async redeem(voucher, domain) {
		return await this.fetch(`./vouchers/${voucher}/`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ domain }),
		});
	}
}
