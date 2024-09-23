# lib js-scram_sha_256
A framework for using scram-sha-256 in javascript [documentation](https://github.com/anunique/js-scram-sha-256/blob/main/README.md).

### Aims
* Lightweight
* Performant
* Very easy to get going out of the box

#### A simple and low-boilerplate framework to use scram-sha-256.
~~~javascript
read the source code, its commented
~~~



#### check the rfc (https://datatracker.ietf.org/doc/html/rfc7677)
Its basicly working like this:
>Client sending username and nonce: n,,n=user,r=rOprNGfwEbeRWgbNEkqO
>Server adding new bytes to nonce and sending nonce, salt and iterations: r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0,s=W22ZaJ0SNY7soEsUEjb6gQ==,i=4096
>Client responding with nonce and proof: c=biws,r=rOprNGfwEbeRWgbNEkqO%hvYDpWUa2RaTCAfuxFIlj)hNlF$k0,p=dHzbZapWIk4jUhN+Ute9ytag9zjfMHgsqmmiz7AndVQ=
>Server sending signature: v=6rriTRBi23WpRR/wtup+mMhUZUn/dB5nLTJRsjl95G4=
