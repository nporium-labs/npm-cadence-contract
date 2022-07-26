import { mintFlow, executeScript, sendTransaction, deployContractByName } from "flow-js-testing";
import { getNpmAdminAddress } from "./common";

/*
 * Deploys NonFungibleToken and NpmItems contracts to NpmAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const deployNpmItems = async () => {
	const NpmAdmin = await getNpmAdminAddress();
	await mintFlow(NpmAdmin, "10.0");

	await deployContractByName({ to: NpmAdmin, name: "NonFungibleToken" });
	return deployContractByName({ to: NpmAdmin, name: "NPM" });
};

/*
 * Setups NpmItems collection on account and exposes public capability.
 * @param {string} account - account address
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const setupNpmItemsOnAccount = async (account) => {
	const name = "npmitems/SetupUser";
	const signers = [account];

	return sendTransaction({ name, signers });
};

/*
 * Returns NpmItems supply.
 * @throws Will throw an error if execution will be halted
 * @returns {UInt64} - number of NFT minted so far
 * */
export const getNpmItemSupply = async () => {
	const name = "npmitems/get_npm_items_supply";

	return executeScript({ name });
};

/*
 * Mints NpmItem
 * @param {UInt64} ipfs - IPFS
 * @param {string} metadata - NFT metadata
 * @returns {Promise<[{*} result, {error} error]>}
 * */
export const mintNpmItem = async (ipfs, metadata) => {
	const NpmAdmin = await getNpmAdminAddress();

	const name = "npmitems/MintNFT";
	const args = [ipfs, metadata];
	const signers = [NpmAdmin];

	return sendTransaction({ name, args, signers });
};

