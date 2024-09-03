const http = require('http');
const fs = require("fs");

var scram_sha_256 = require('../../../scram_sha_256');

var html = fs.readFileSync("./html/index.html", 'utf8');

var userdb = new Map();
var usernonce = new Map();

function isvalidusername(username)
{
	//you might want to format body.user to prevent injections or other stupid shit!
	return true;
}

function SendResponse(res, code, msg)
{
	res.writeHead(code, { 'Content-Type': 'application/json' });
	res.end(
		JSON.stringify({
			message: msg,
		})
	);
}

function ParseRequest(req, res, func) {
	if (req.headers['content-type'] !== 'application/json') {
		SendResponse(res, 400, "Invalid Request");
		return;
	}
	try {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			func(res, JSON.parse(body));
		});
	} catch (error) {
		SendResponse(res, 400, error);
	}
}

const server = http.createServer((req, res) => {
	if (req.url === '/' && req.method === 'GET')
	{
		res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
		res.write(html);
		res.end();
	}
	else if (req.url === '/auth' && req.method === 'POST')
	{
		ParseRequest(req, res, doauth);
	}
	else if (req.url === '/login' && req.method === 'POST')
	{
		ParseRequest(req, res, dologin);
	}
	else if (req.url === '/register' && req.method === 'PUT')
	{
		ParseRequest(req, res, doregister);
	}
	else
	{
		SendResponse(res, 400, "Invalid Request");
	}
});

function doregister(res, body)
{

	try {
		let user = body.user;
		if (!isvalidusername(user))
		{
			SendResponse(res, 400, "Invalid username");
			return;
		}
		if (userdb.has(user))
		{
			SendResponse(res, 401, "User exists");
			return;
		}
		let salt = Buffer.from(body.salt, 'base64');
		if (salt.length != 32)
		{
			SendResponse(res, 400, "Invalid Request. Salt needs to be 32 Bytes");
			return;
		}
		let ServerKey = Buffer.from(body.ServerKey, 'base64');
		if (ServerKey.length != 32)
		{
			SendResponse(res, 400, "Invalid Request. ServerKey needs to be 32 Bytes");
			return;
		}
		let ClientKeyHash = Buffer.from(body.ClientKeyHash, 'base64');
		if (ClientKeyHash.length != 32)
		{
			SendResponse(res, 400, "Invalid Request. ClientKeyHash needs to be 32 Bytes");
			return;
		}
		if (body.iterations < 10000)
		{
			SendResponse(res, 400, "Invalid Request. iterations need to be at least 10000");
			return;
		}
		let db_data = new Object();
		db_data.salt = salt;
		db_data.iterations = body.iterations;
		db_data.ServerKey = ServerKey;
		db_data.ClientKeyHash = ClientKeyHash;
		userdb.set(user, db_data);
		SendResponse(res, 201, "User registration complete");
	} catch(error) {
		SendResponse(res, 400, "Invalid Request");
	}
}

function dologin(res, body)
{
	try {
		if (!isvalidusername(body.user))
		{
			SendResponse(res, 400, "Invalid username");
			return;
		}
		if (!userdb.has(body.user))
		{
			SendResponse(res, 401, "User doesnt exist");
			return;
		}
		let user = userdb.get(body.user);
		let nonce = Buffer.from(body.nonce, 'base64');
		if (nonce.length != 16)
		{
			SendResponse(res, 400, "Invalid Request");
			return;
		}
		nonce = scram_sha_256.server_create_nonce(nonce, 16);
		let data = new Object();
		data.nonce = nonce;
		data.ServerKey = user.ServerKey;
		data.ClientKeyHash = user.ClientKeyHash;
		usernonce.set(body.user, data);
		data = new Object();
		data.iterations = user.iterations;
		data.salt = user.salt.toString("base64");
		data.nonce = nonce.toString("base64");
		SendResponse(res, 202, JSON.stringify(data));
	} catch(error) {
		SendResponse(res, 400, "Invalid Request");
	}
}

function doauth(res, body)
{
	try {

		let data = usernonce.get(body.user);
		let proof = Buffer.from(body.proof, 'base64');
		if (proof.length != 32)
		{
			SendResponse(res, 400, "Invalid Request. Proof needs to be 32 bytes");
			return;
		}
		let server_result = scram_sha_256.server_verify_client_proof(data.nonce, proof, data.ClientKeyHash);
		if (!server_result)
		{
			SendResponse(res, 401, "Wrong Password");
			return;
		}
		let server_signature = scram_sha_256.server_calculate_signature(data.nonce, data.ServerKey);
		data = new Object();
		data.signature = server_signature.toString("base64");
		SendResponse(res, 200, JSON.stringify(data));
		//SUCCESSFUL LOGIN
	} catch(error) {
		SendResponse(res, 400, "Invalid Request");
	}
}

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));