const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
	//http//127.0.0.1:7545
	const provider = new ethers.providers.JsonRpcProvider("HTTP://0.0.0.0:7545");
	const wallet = new ethers.Wallet(
		"785ea7ce216e48bf7357f95236a95e35b2528eea7b68354f94f1d88bcc5c0deb",
		provider
	);
	const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
	const binary = fs.readFileSync(
		"./SimpleStorage_sol_SimpleStorage.bin",
		"utf-8"
	);
	const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
	console.log("Deploying, Please wait ...");
	const contract = await contractFactory.deploy();
	const deploymentReciept = await contract.deployTransaction.wait(1);
	console.log(deploymentReciept);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
