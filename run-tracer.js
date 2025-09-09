const fs = require("fs");

async function main() {
	if (process.argv.length !== 4) {
		console.error("Usage: node run-tracer.js <transaction_hash> <tracer_file>");
		process.exit(1);
	}
	if (!process.env.ETH_RPC_URL) {
		console.error("Environment variable ETH_RPC_URL is not defined");
		process.exit(1);
	} 
	const rpcUrl = process.env.ETH_RPC_URL;
	const txHash = process.argv[2];
	const tracerFile = process.argv[3];

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
