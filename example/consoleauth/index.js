var scram_sha_256 = require('../../../scram_sha_256');
var userdb = new Map();

function register(user, password)
{
    console.log("REGISTER: U="+user+",P="+password);
    //client
    let client_ecdh_key = scram_sha_256.ecdh_generate_keys();
    console.log("C: user="+user+" public_key="+client_ecdh_key.public_key.toString('base64'));
    //server
    if (userdb.has(user))
        return false;
    let server_ecdh_key = scram_sha_256.ecdh_generate_keys();
    console.log("S: public_key="+ server_ecdh_key.public_key.toString('base64'));
    //client
    let salt = scram_sha_256.create_random(32);
    let iterations = 10000;
    let client_keys = scram_sha_256.client_create_keys(password, salt, iterations);
    let client_shared_secret = scram_sha_256.ecdh_compute_secret(client_ecdh_key.private_key, server_ecdh_key.public_key);
    if (!client_shared_secret)
        return false;
    let encrypted_server_key = scram_sha_256.xor_buffer(client_keys.server_key, client_shared_secret);
    if (!encrypted_server_key)
        return false;
    let encrypted_client_key_hash = scram_sha_256.xor_buffer(client_keys.client_key_hash, client_shared_secret);
    if (!encrypted_client_key_hash)
        return false;
    console.log("C: user="+user+",salt="+ salt.toString('base64')+ ",iterations="+ iterations+ ",server_key="+encrypted_server_key.toString('base64')+",client_key_hash="+ encrypted_client_key_hash.toString('base64'));
    //server
    let server_shared_secret = scram_sha_256.ecdh_compute_secret(server_ecdh_key.private_key, client_ecdh_key.public_key);
    if (!server_shared_secret)
        return false;
    let decrypted_server_key = scram_sha_256.xor_buffer(encrypted_server_key, server_shared_secret);
    if (!decrypted_server_key)
        return false;
    let decrypted_client_key_hash = scram_sha_256.xor_buffer(encrypted_client_key_hash, server_shared_secret);
    if (!decrypted_client_key_hash)
        return false;
    let db_data = new Object();
    db_data.salt = salt;
    db_data.iterations = iterations;
    db_data.server_key = decrypted_server_key;
    db_data.client_key_hash = decrypted_client_key_hash;
    userdb.set(user, db_data);
    return true;
}

function login(user, password) {
    console.log("LOGIN: U="+user+",P="+password);
    //client
    let client_nonce = scram_sha_256.create_random(16);
    let client_first_message = scram_sha_256.client_create_first_message("testuser", client_nonce);
    console.log("C: ", client_first_message);
    //server
    let client_data = scram_sha_256.server_parse_client_first_message(client_first_message);
    if (!userdb.has(client_data.username))
        return false;
    let db_data = userdb.get(client_data.username);
    let server_nonce = scram_sha_256.server_create_nonce(client_data.client_nonce, 16);
    let server_first_message = scram_sha_256.server_create_first_message(db_data.salt, db_data.iterations, server_nonce);
    console.log("S: ", server_first_message);
    //client
    let server_data = scram_sha_256.client_parse_server_first_message(server_first_message);
    let client_keys = scram_sha_256.client_create_keys(password, server_data.salt, server_data.iterations);
    let client_proof = scram_sha_256.client_calculate_proof(server_data.random_nonce, client_keys.client_key, client_keys.client_key_hash);
    let client_final_message = scram_sha_256.client_create_final_message(server_data.random_nonce, client_proof);
    console.log("C: ", client_final_message);
    //server
    let server_final_data = scram_sha_256.server_parse_client_final_message(client_final_message);
    let server_result = scram_sha_256.server_verify_client_proof(server_nonce, server_final_data.client_proof, db_data.client_key_hash);
    if (!server_result)
        return false;
    let server_signature = scram_sha_256.server_calculate_signature(server_nonce, db_data.server_key);
    let server_final_message = scram_sha_256.server_create_final_message(server_signature);
    console.log("S: ", server_final_message);
    //client
    let signature = scram_sha_256.client_parse_server_final_message(server_final_message);
    let client_result = scram_sha_256.client_verify_server_signature(server_data.random_nonce, client_keys.server_key, signature);
    return client_result;
}

function checkregister(username, password) {
    if (!register(username, password)) {
            console.log("ERROR, UNABLE TO REGISTER USER " + username);
    } else {
        console.log("REGISTERED USER " + username);
    }        
}

function checklogin(username, password) {
    if (!login(username, password)) {
            console.log("ERROR, UNABLE TO LOGIN USER " + username);
    } else {
        console.log("WELCOME USER " + username);
    }        
}

checkregister("testuser", "testpassword");
checklogin("testuser", "testpassword");
checklogin("testuser", "testpassword");
checklogin("testuser", "testpassword1");
checklogin("testuser1", "testpassword1");
checklogin("testuser", "testpassword2");