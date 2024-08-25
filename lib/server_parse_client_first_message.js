'use strict';
const is_valid_username = require("./is_valid_username");
/*** server_parse_client_first_message(client_first_message)
 * @brief parses client first message
 * 
 * @param {string} client_first_message client first message
 * @returns {{username: string, client_nonce: Buffer}} on false: undefined, on success: Object
 */
module.exports = function server_parse_client_first_message(client_first_message) {
	let params = client_first_message.split(",");
	let username;
	let client_nonce;
	if (params.length < 2)
		return undefined;
	for (let i=0;i<params.length;i++)
	{
		if (params[i][1] != "=")
			return undefined;
		if (params[i][0] == "n")
		{
			if (typeof username !== "undefined")
				return undefined;
			username = params[i].substring(2);
			if (!is_valid_username(username))
				return undefined;
		}
		if (params[i][0] == "r")
		{
			if (client_nonce)
				return undefined;
			client_nonce = Buffer.from(params[i].substring(2), 'base64');
			if (client_nonce.length == 0)
				return undefined;
		}
	}
	if (!username)
		return undefined;
	if (!client_nonce)
		return undefined;
	let data = new Object();
	data.username = username;
	data.client_nonce = client_nonce;
	return data;
};