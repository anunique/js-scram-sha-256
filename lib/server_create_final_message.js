'use strict';

/*** server_create_final_message(server_signature)
 * @brief generates server final message
 * 
 * @param {Buffer} server_signature server_signature
 * @returns {string} failure: undefined, success: encoded client final message
 */
module.exports = function server_create_final_message(server_signature) {
	if (!Buffer.isBuffer(server_signature))
		return undefined;
	return "v="+server_signature.toString('base64');
};
