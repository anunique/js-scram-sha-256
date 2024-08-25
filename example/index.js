var scram_sha_256 = require('../scram_sha_256');
var userdb = new Map();

function register(user, password)
{
    console.log("REGISTER: U="+user+",P="+password);
    let salt = scram_sha_256.create_random(24);
    let iterations = 4096;
    let client_keys = scram_sha_256.client_create_keys(password, salt, iterations);
    //ONLY TRANSMIT salt, iterations, server_key, client_key_hash!!!!
    //client_key and especially the hashed password are staying on client side only
    if (userdb.has(user))
        return false;
    let db_data = new Object();
    db_data.salt = salt;
    db_data.iterations = iterations;
    db_data.server_key = client_keys.server_key;
    db_data.client_key_hash = client_keys.client_key_hash;
    userdb.set(user, db_data);
    return true;
}

function login(user, password) {
    console.log("LOGIN: U="+user+",P="+password);
    let client_nonce = scram_sha_256.create_random(24);
    let client_first_message = scram_sha_256.client_create_first_message("testuser", client_nonce);
    console.log("C: ", client_first_message);

    let client_data = scram_sha_256.server_parse_client_first_message(client_first_message);
    if (!userdb.has(client_data.username))
        return false;
    let db_data = userdb.get(client_data.username);
    let server_nonce = scram_sha_256.server_create_nonce(client_data.client_nonce, 24);
    let server_first_message = scram_sha_256.server_create_first_message(db_data.salt, db_data.iterations, server_nonce);
    console.log("S: ", server_first_message);
    
    let server_data = scram_sha_256.client_parse_server_first_message(server_first_message);
    let client_keys = scram_sha_256.client_create_keys(password, server_data.salt, server_data.iterations);
    let client_proof = scram_sha_256.client_calculate_proof(server_data.random_nonce, client_keys.client_key, client_keys.client_key_hash);
    let client_final_message = scram_sha_256.client_create_final_message(server_data.random_nonce, client_proof);
    console.log("C: ", client_final_message);
    
    let server_final_data = scram_sha_256.server_parse_client_final_message(client_final_message);
    let server_result = scram_sha_256.server_verify_client_proof(server_nonce, server_final_data.client_proof, db_data.client_key_hash);
    if (!server_result)
        return false;
    let server_signature = scram_sha_256.server_calculate_signature(server_nonce, db_data.server_key);
    let server_final_message = scram_sha_256.server_create_final_message(server_signature);
    console.log("S: ", server_final_message);
    
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