const { createHash, createHmac } = require('node:crypto');
'use strict';
/*** server_verify_client_proof(random_nonce, client_proof, client_key_hash)
 * @brief verifies client proof
 * 
 * @param {base64} random_nonce random_nonce
 * @param {base64} client_proof client_proof
 * @param {base64} client_key_hash client_key_hash
  * @returns false on failure, true on success
 */
module.exports = function server_verify_client_proof(random_nonce, client_proof, client_key_hash) {
    if (!Buffer.isBuffer(random_nonce))
		return false;
	if (!Buffer.isBuffer(client_proof))
		return false;
	if (!Buffer.isBuffer(client_key_hash))
		return false;
	let hmac = createHmac('sha256', client_key_hash);
	hmac.update(random_nonce);
	let client_key = hmac.digest();
	if (client_proof.length != client_key.length)
		return undefined;
    for (let i=0;i<client_proof.length;i++)
	{
		client_key[i] ^= client_proof[i];
	}
	
	let hash = createHash('sha256');
	hash.update(client_key);
	let calculated_key_hash = hash.digest();
    if (Buffer.compare(calculated_key_hash, client_key_hash) != 0)
        return false;
    return true;
};