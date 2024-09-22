'use strict';
/*** xor_buffer(buffer, key)
 * @brief xors buffer and key with each other. key must be larger than buffer
 * 
 * @param {Buffer} buffer buffer to be xored
 * @param {Buffer} key key to xor the buffer
 * @returns {Buffer } undefined on failure, Buffer with encrypted bytes on success
 */
module.exports = function xor_buffer(buffer, key) {
	if (!Buffer.isBuffer(buffer))
		return undefined;
	if (!Buffer.isBuffer(key))
		return undefined;
	if (key.length < buffer.length)
		return undefined;
	let result = Buffer.from(buffer);
	for (let i = 0 ; i < buffer.length ; i++)
		result[i] ^= key[i];
	return result;
};