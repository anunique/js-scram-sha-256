'use strict';
/*** server_parse_client_final_message(client_final_message)
 * @brief parses client final message
 * 
 * @param {string} client_final_message client final message
 * @returns {{random_nonce: Buffer, client_proof: Buffer}}} on false: undefined, on success: Object
 */
module.exports = function server_parse_client_final_message(client_final_message) {
	let params = client_final_message.split(",");
	let client_proof;
	let random_nonce;
	if (params.length < 2)
		return undefined;
	for (let i=0;i<params.length;i++)
	{
		if (params[i][1] != "=")
			return undefined;
		if (params[i][0] == "p")
		{
			if (client_proof)
				return undefined;
			client_proof = Buffer.from(params[i].substring(2), 'base64');
			if (client_proof.length == 0)
				return undefined;
		}
		if (params[i][0] == "r")
		{
			if (random_nonce)
				return undefined;
			random_nonce = Buffer.from(params[i].substring(2), 'base64');
			if (random_nonce.length == 0)
				return undefined;
		}
	
	}
	if (!client_proof)
		return undefined;
	if (!random_nonce)
		return undefined;
	let data = new Object();
	data.random_nonce = random_nonce;
	data.client_proof = client_proof;
	return data;
};