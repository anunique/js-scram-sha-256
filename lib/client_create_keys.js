const { createHash, createHmac, pbkdf2Sync } = require('node:crypto');

'use strict';
/*** client_create_keys(password, salt, iterations)
 * @brief generates client keypair
 * 
 * @param {string} password username
 * @param {Buffer} salt salt
 * @param {Number} iterations iterations
 * @returns {{hashed_password: Buffer, client_key: Buffer, client_key_hash: Buffer, server_key: Buffer}} on false: undefined, on success: Object
 */
module.exports = function client_create_keys(password, salt, iterations) {
	if (!Buffer.isBuffer(salt))
		return undefined;
	if (typeof iterations != "number")
		return undefined;
	if (iterations < 1)
		return undefined;
	let password_buffer = Buffer.from(password);
	if (password_buffer.length < 1)
		return undefined;
	let hashed_password = pbkdf2Sync(password_buffer, salt, iterations, 32, 'sha256');

	let hmac = createHmac('sha256', hashed_password);
	hmac.update("Client Key");
	let client_key = hmac.digest();
	
	hmac = createHmac('sha256', hashed_password);
	hmac.update("Server Key");
	let server_key = hmac.digest();

	let hash = createHash('sha256');
	hash.update(client_key);
	let client_key_hash = hash.digest();

	let data = new Object();
	data.hashed_password = hashed_password;
	data.client_key = client_key;
	data.server_key = server_key;
	data.client_key_hash = client_key_hash;
	return data;
};