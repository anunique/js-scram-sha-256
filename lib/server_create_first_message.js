'use strict';
/*** server_create_first_message(client_salt, client_iterations, server_nonce)
 * @brief generates server first message
 * 
 * @param {Buffer} client_salt salt used to calculate the hashed password
 * @param {unsigned_number} client_iterations number of iterations for hash calculation
 * @param {Buffer} server_nonce result of server_create_nonce
 * @returns {string} on failure: undefined, on success: encoded server first message
 */
module.exports = function server_create_first_message(client_salt, client_iterations, server_nonce) {
	if (!Buffer.isBuffer(client_salt))
		return undefined;
	if (!Buffer.isBuffer(server_nonce))
		return undefined;
	if (typeof client_iterations != "number")
		return undefined;
	if (client_iterations < 1)
		return undefined;
	return "r="+server_nonce.toString('base64')+",s="+client_salt.toString('base64')+",i="+client_iterations.toString();
};