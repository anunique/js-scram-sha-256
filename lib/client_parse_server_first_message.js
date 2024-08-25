'use strict';
/*** client_parse_server_first_message(server_first_message)
 * @brief parses server first message
 * 
 * @param {string} server_first_message server first message
 * @returns {{random_nonce: Buffer, salt: Buffer, iterations: Number}} on false: undefined, on success: Object
 */
module.exports = function client_parse_server_first_message(server_first_message) {
	let params = server_first_message.split(",");
	let iterations;
	let random_nonce;
	let salt;
	if (params.length < 3)
		return undefined;
	for (let i=0;i<params.length;i++)
	{
		if (params[i][1] != "=")
			return undefined;
		if (params[i][0] == "r")
		{
			if (typeof random_nonce !== "undefined")
				return undefined;
			random_nonce = Buffer.from(params[i].substring(2), 'base64');
			if (random_nonce.length == 0)
				return undefined;
		}
		if (params[i][0] == "s")
		{
			if (salt)
				return undefined;
			salt = Buffer.from(params[i].substring(2), 'base64');
			if (salt.length == 0)
				return undefined;
		}
		if (params[i][0] == "i")
			{
				if (iterations)
					return undefined;
				iterations = Number(params[i].substring(2));
				if (iterations == NaN)
					return undefined;
			}
	}
	if (!random_nonce)
		return undefined;
	if (!salt)
		return undefined;
	if (!iterations)
		return undefined;
	if (!iterations == NaN)
		return undefined;
	let data = new Object();
	data.random_nonce = random_nonce;
	data.salt = salt;
	data.iterations = iterations;
	return data;
};