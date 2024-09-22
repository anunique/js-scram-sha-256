'use strict';
const { createECDH, ECDH } = require('node:crypto');

/*** ecdh_compute_secret(private_key, public_key)
 * @brief computes a ecdh secret out of a private_key and a public_key
 *
 * @param {private_key} private_key key to calculate a shared secret
 * @param {public_key} public_key key to calculate a shared secret
 * @returns { Buffer } on false: undefined, on success: shared Secret
 */
module.exports = function ecdh_generate_keys(private_key, public_key) {
	try {
		let ecdh = createECDH('secp384r1');
		ecdh.setPrivateKey(private_key);
		return ecdh.computeSecret(public_key); 
	}
	catch (err) {
	}
	return undefined;
};
