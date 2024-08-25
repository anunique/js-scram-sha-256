'use strict';
const { randomBytes } = require('node:crypto');

/*** server_create_nonce(client_nonce, bytes)
 * @brief generates server nonce 
 * 
 * @param {Buffer} client_nonce value send by client with client_first 
 * @param {unsigned_number} bytes number of random bytes to create
 * @returns {Buffer} undefined on failure, server_nonce on success
  */
module.exports = function server_create_nonce(client_nonce, bytes) {
	if (!Buffer.isBuffer(client_nonce))
		return undefined;
	if (typeof bytes != "number")
		return undefined;
	return Buffer.concat([client_nonce, Buffer.from(new Uint8Array(randomBytes(bytes)))]);
};