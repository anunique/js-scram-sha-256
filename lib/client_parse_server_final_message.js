'use strict';
/*** client_parse_server_final_message(server_final_message)
 * @brief parses server final message
 * 
 * @param {string} server_final_message server final message
 * @returns {Buffer} on false: undefined, on success: server_signature
 */
module.exports = function client_parse_server_final_message(server_final_message) {
	let params = server_final_message.split(",");
	let server_signature;
	if (params.length != 1)
		return undefined;
	for (let i=0;i<params.length;i++)
	{
		if (params[i][1] != "=")
			return undefined;
		if (params[i][0] == "v")
		{
			if (typeof server_signature !== "undefined")
				return undefined;
			server_signature = Buffer.from(params[i].substring(2), 'base64');
			if (server_signature.length == 0)
				return undefined;
		}
	}
	if (!server_signature)
		return undefined;
	return server_signature;
};