# lib js-scram_sha_256
A framework for using scram-sha-256 in javascript. [README.md](https://github.com/anunique/js-scram-sha-256/blob/main/README.md).

### Aims
* Lightweight
* Performant
* Very easy to get going out of the box

#### A simple and low-boilerplate framework to use scram-sha-256.
Check out the API functions here: (https://github.com/anunique/js-scram-sha-256/blob/main/docs/api.md).

#### How does it work?
##### Login
Its basicly working like this:
>Client sending username and nonce: `n=user,r=rOprNGfwEbeRWgbNEkqO`<br />
>Server adding new bytes to nonce and sending nonce, salt and iterations: `r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0,s=W22ZaJ0SNY7soEsUEjb6gQ==,i=4096`<br />
>Client responding with nonce and proof: `r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0,p=dHzbZapWIk4jUhN+Ute9ytag9zjfMHgsqmmiz7AndVQ=`<br />
>Server sending signature: `v=6rriTRBi23WpRR/wtup+mMhUZUn/dB5nLTJRsjl95G4=`<br />

##### Registration
For registration its basicly working like this:
>Client sending registration request and a public ECDH key.<br />
>Server is responding with a public ECDH key<br />
>Client is sending salt, iterations, ECDH encrypted ServerKey, ECDH encrypted ClientKeyHash<br />
>Server is decrypting the data and storing it inside of a db.<br />

##### RFC
check the rfc (https://datatracker.ietf.org/doc/html/rfc7677)