# API Documentation

### Server APIs
~~~javascript
/*** server_create_nonce(client_nonce, bytes)
 * @brief generates server nonce 
 * 
 * @param {Buffer} client_nonce value send by client with client_first 
 * @param {unsigned_number} bytes number of random bytes to create
 * @returns {Buffer} undefined on failure, server_nonce on success
 */
~~~

~~~javascript
/*** server_parse_client_first_message(client_first_message)
 * @brief parses client first message
 * 
 * @param {string} client_first_message client first message
 * @returns {{username: string, client_nonce: Buffer}} on false: undefined, on success: Object
 */
~~~

~~~javascript
/*** server_create_first_message(client_salt, client_iterations, server_nonce)
 * @brief generates server first message
 * 
 * @param {Buffer} client_salt salt used to calculate the hashed password
 * @param {unsigned_number} client_iterations number of iterations for hash calculation
 * @param {Buffer} server_nonce result of server_create_nonce
 * @returns {string} on failure: undefined, on success: encoded server first message
 */
~~~

~~~javascript
/*** server_create_final_message(server_signature)
 * @brief generates server final message
 * 
 * @param {Buffer} server_signature server_signature
 * @returns {string} failure: undefined, success: encoded client final message
 */
~~~

~~~javascript
/*** server_parse_client_final_message(client_final_message)
 * @brief parses client final message
 * 
 * @param {string} client_final_message client final message
 * @returns {{random_nonce: Buffer, client_proof: Buffer}}} on false: undefined, on success: Object
 */
~~~

~~~javascript
/*** server_verify_client_proof(random_nonce, client_proof, client_key_hash)
 * @brief verifies client proof
 * 
 * @param {base64} random_nonce random_nonce
 * @param {base64} client_proof client_proof
 * @param {base64} client_key_hash client_key_hash
 * @returns false on failure, true on success
 */
~~~

~~~javascript
/*** server_calculate_signature(random_nonce, server_key)
 * @brief calculates server signature
 * 
 * @param {Buffer} random_nonce random_nonce
 * @param {Buffer} server_key server_key
 * @returns {Buffer} on false: undefined, on success: server_signature
 */
~~~

### Client APIs
~~~javascript
/*** client_create_keys(password, salt, iterations)
 * @brief generates client keypair
 * 
 * @param {string} password username
 * @param {Buffer} salt salt
 * @param {Number} iterations iterations
 * @returns {{hashed_password: Buffer, client_key: Buffer, client_key_hash: Buffer, server_key: Buffer}} on false: undefined, on success: Object
 */
~~~

~~~javascript
/*** client_create_first_message(username, client_nonce)
 * @brief generates client first message
 * 
 * @param {string} username username
 * @param {Buffer} client_nonce client_nonce
 * @returns {string} failure: undefined, success: encoded client first message
 */
~~~

~~~javascript
/*** client_parse_server_first_message(server_first_message)
 * @brief parses server first message
 * 
 * @param {string} server_first_message server first message
 * @returns {{random_nonce: Buffer, salt: Buffer, iterations: Number}} on false: undefined, on success: Object
 */
~~~

~~~javascript
/*** client_calculate_proof(random_nonce, client_key, client_key_hash)
 * @brief calculates client proof
 * 
 * @param {Buffer} random_nonce random_nonce
 * @param {Buffer} client_key client_key
 * @param {Buffer} client_key_hash client_key_hash
 * @returns {Buffer} on false: undefined, on success: client_proof
 */
~~~

~~~javascript
/*** client_create_final_message(random_nonce, client_proof)
 * @brief generates client final message
 * 
 * @param {Buffer} random_nonce random_nonce
 * @param {Buffer} client_proof client_proof
 * @returns {string} failure: undefined, success: encoded client final message
 */
~~~

~~~javascript
/*** client_parse_server_final_message(server_final_message)
 * @brief parses server final message
 * 
 * @param {string} server_final_message server final message
 * @returns {Buffer} on false: undefined, on success: server_signature
 */
~~~
 
~~~javascript
/*** client_verify_server_signature(random_nonce, server_key, server_signature)
 * @brief verifies server signature
 * 
 * @param {base64} random_nonce random_nonce
 * @param {base64} server_key server_key
 * @param {base64} server_signature server_signature
 * @returns false on failure, true on success
 */
~~~

### Helpers
~~~javascript
/*** create_random(bytes)
 * @brief generates base64 encoded random string
 * 
 * @param {unsigned_number} bytes number of random bytes to create
 * @returns {Buffer } undefined on failure, Buffer with random bytes on success
 */
~~~
 
~~~javascript
/*** is_valid_username(name)
 * @brief checks if name is valid
 * 
 * @param {string} name name
 * @returns false on failure, true on success
 */
~~~

### public key crypto
~~~javascript
/*** ecdh_generate_keys()
 * @brief generates a ecdh keypair
 * 
 * @returns { public_key: Buffer, private_key: Buffer } Object
 */
~~~

~~~javascript
/*** ecdh_compute_secret(private_key, public_key)
 * @brief computes a ecdh secret out of a private_key and a public_key
 *
 * @param {private_key} private_key key to calculate a shared secret
 * @param {public_key} public_key key to calculate a shared secret
 * @returns { Buffer } on false: undefined, on success: shared Secret
 */
~~~

~~~javascript
/*** xor_buffer(buffer, key)
 * @brief xors buffer and key with each other. key must be larger than buffer
 * 
 * @param {Buffer} buffer buffer to be xored
 * @param {Buffer} key key to xor the buffer
 * @returns {Buffer } undefined on failure, Buffer with encrypted bytes on success
 */
~~~
