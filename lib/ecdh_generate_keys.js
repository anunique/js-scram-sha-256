'use strict';
const { createECDH, ECDH } = require('node:crypto');

/*** ecdh_generate_keys()
 * @brief generates a ecdh keypair
 * 
 * @returns { public_key: Buffer, private_key: Buffer } Object
 */
module.exports = function ecdh_generate_keys() {
	let ecdh = createECDH('secp384r1');
	ecdh.generateKeys();
	let data = new Object();
	data.public_key = ecdh.getPublicKey();
	data.private_key = ecdh.getPrivateKey();
	return data;
};