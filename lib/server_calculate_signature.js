const { createHmac } = require('node:crypto');

'use strict';
/*** server_calculate_signature(random_nonce, server_key)
 * @brief calculates server signature
 * 
 * @param {Buffer} random_nonce random_nonce
 * @param {Buffer} server_key server_key
 * @returns {Buffer} on false: undefined, on success: server_signature
 */
module.exports = function server_calculate_signature(random_nonce, server_key) {
	if (!Buffer.isBuffer(random_nonce))
		return undefined;
	if (!Buffer.isBuffer(server_key))
		return undefined;
	let hmac = createHmac('sha256', server_key);
	hmac.update(random_nonce);
	let server_signature = hmac.digest();
	if (server_signature.length != server_key.length)
		return undefined;
	return server_signature;
};