const { createHash, createHmac } = require('node:crypto');
'use strict';
/*** client_verify_server_signature(random_nonce, server_key, server_signature)
 * @brief verifies server signature
 * 
 * @param {base64} random_nonce random_nonce
 * @param {base64} server_key server_key
 * @param {base64} server_signature server_signature
  * @returns false on failure, true on success
 */
module.exports = function client_verify_server_signature(random_nonce, server_key, server_signature) {
	if (!Buffer.isBuffer(random_nonce))
		return false;
	if (!Buffer.isBuffer(server_key))
		return false;
	if (!Buffer.isBuffer(server_signature))
		return false;
	let hmac = createHmac('sha256', server_key);
	hmac.update(random_nonce);
	let signature = hmac.digest();
    if (Buffer.compare(signature, server_signature) != 0)
        return false;
    return true;
};