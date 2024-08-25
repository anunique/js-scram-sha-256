'use strict';

/*** client_create_final_message(random_nonce, client_proof)
 * @brief generates client final message
 * 
 * @param {Buffer} random_nonce random_nonce
 * @param {Buffer} client_proof client_proof
 * @returns {string} failure: undefined, success: encoded client final message
 */
module.exports = function client_create_final_message(random_nonce, client_proof) {
	if (!Buffer.isBuffer(random_nonce))
		return undefined;
	if (!Buffer.isBuffer(client_proof))
		return undefined;
	return "r="+random_nonce.toString('base64')+",p="+client_proof.toString('base64');
};
