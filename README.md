# simple-geth-tracing

Provides a simple mechanism to execute custom tracers against geth. Geth makes
it difficult to execute custom tracers because the javascript needs to be
escaped when sent in a call to the RPC, alternatively you could attach to the
geth console and load a tracer from a file but then you need to have local
access to the disk of the geth instance.

This repository makes it easy to edit tracers inside their js files with
IDE/Language server support while also automating the process of generating
escaped tracer code and calling trace transaction endpoint with it.

# Writing a tracer

It is expected that tracer files have the form `tracer = {<tacer implementation>}`,
see
[here](https://geth.ethereum.org/docs/developers/evm-tracing/javascript-tutorial)
for a guide on writing the tracer.

# Running a tracer

The included tracer can be run as follows:
```
ETH_RPC_URL=<geth-rpc-endpoint> node run-tracer.js <tx-hash> tracers/top-level-call-gas-tracer.js | jq
```
Here the output is piped to `jq` which formats the JSON, but it's not necessary.

The rpc endpoint is read from the `ETH_RPC_URL` environment variable (also used
by founry's cast), this can be specified when calling or exported in your environment.

Note that unless you are tracing transactions from the most recent of blocks,
you will likely need an archive RPC node.
