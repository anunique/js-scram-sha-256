const { createHmac } = require('node:crypto');

'use strict';
/*** client_calculate_proof(random_nonce, client_key, client_key_hash)
 * @brief calculates client proof
 * 
 * @param {Buffer} random_nonce random_nonce
 * @param {Buffer} client_key client_key
 * @param {Buffer} client_key_hash client_key_hash
 * @returns {Buffer} on false: undefined, on success: client_proof
 */
module.exports = function client_calculate_proof(random_nonce, client_key, client_key_hash) {
	if (!Buffer.isBuffer(random_nonce))
		return undefined;
	if (!Buffer.isBuffer(client_key_hash))
		return undefined;
	let hmac = createHmac('sha256', client_key_hash);
	hmac.update(random_nonce);
	let client_proof = hmac.digest();
	if (client_proof.length != client_key.length)
		return undefined;
	for (let i=0;i<client_proof.length;i++)
	{
		client_proof[i] ^= client_key[i];
	}
	return client_proof;
};