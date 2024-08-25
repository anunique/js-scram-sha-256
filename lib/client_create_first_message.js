'use strict';
const is_valid_username = require("./is_valid_username");

/*** client_create_first_message(username, client_nonce)
 * @brief generates client first message
 * 
 * @param {string} username username
 * @param {Buffer} client_nonce client_nonce
 * @returns {string} failure: undefined, success: encoded client first message
 */
module.exports = function client_create_first_message(username, client_nonce) {
	if (!is_valid_username(username))
		return undefined;
	return "n="+username+",r="+client_nonce.toString('base64');
};