// Load Dependencies
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
	const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

	const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
	let wallet = new ethers.Wallet.fromEncryptedJsonSync(
		encryptedJson,
		process.env.PRIVATE_KEY_PASSWORD
	);
	wallet = await wallet.connect(provider);
	const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
	const binary = fs.readFileSync(
		"./SimpleStorage_sol_SimpleStorage.bin",
		"utf-8"
	);
	const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

	console.log("Deploying, Please wait ...");
	const contract = await contractFactory.deploy();
	await contract.deployTransaction.wait(1);
	// Get Number
	const currentFavoriteNumber = await contract.retrive();
	console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
	const transactionResponse = await contract.store("7");
	const transactionReciept = await transactionResponse.wait(1);
	const updatedFavoriteNumber = await contract.retrive();
	console.log(`Updated Favorite Number: ${updatedFavoriteNumber.toString()}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
