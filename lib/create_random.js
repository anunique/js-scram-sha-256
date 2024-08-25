'use strict';
const { randomBytes } = require('node:crypto');

/*** create_random(bytes)
 * @brief generates base64 encoded random string
 * 
 * @param {unsigned_number} bytes number of random bytes to create
 * @returns {Buffer } undefined on failure, Buffer with random bytes on success
  */
module.exports = function create_random(bytes) {
	if (typeof bytes != "number")
		return undefined;
	if (bytes < 1)
		return undefined;
	return Buffer.from(new Uint8Array(randomBytes(bytes)));
};