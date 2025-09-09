const fs = require("fs");

async function main() {
  if (process.argv.length !== 5) {
    console.error("Usage: node run-tracer.js <rpc_url> <transaction_hash> <tracer_file>");
    process.exit(1);
  }

  const rpcUrl = process.argv[2];
  const txHash = process.argv[3];
  const tracerFile = process.argv[4];

  // read the tracer file as text
  let tracerCode = fs.readFileSync(tracerFile, "utf8");

  // remove comments and `let tracer =` and optional semicolon
  tracerCode = tracerCode
    .replace(/\/\/.*/, "")
    .replace(/^\s*let\s+tracer\s*=\s*/, "")
    .replace(/;?\s*$/, "")
    .trim();

  // Call the debug_traceTransaction RPC
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "debug_traceTransaction",
      params: [txHash, { tracer: tracerCode }],
    }),
  });

  console.log(await response.text());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
