import { deployContractByName, sendTransaction, executeScript } from "flow-js-testing"
import { getNpmAdminAddress } from "./common";
import { deployNpmItems, setupNpmItemsOnAccount } from "./npmitems";

/*
 * Deploys NpmItems and NFTMarketplace contracts to NpmAdmin.
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const deployNFTMarketplace = async () => {
	const NpmAdmin = await getNpmAdminAddress();
	await deployNpmItems();

	return deployContractByName({ to: NpmAdmin, name: "NFTMarketplace" });
};

/*
 * Sets up NFTMarketplace.Marketplace on account and exposes public capability.
 * @param {string} account - account address
 * @throws Will throw an error if transaction is reverted.
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const setupMarketplaceOnAccount = async (account) => {
	// Account shall be able to store Npm Items
	await setupNpmItemsOnAccount(account);

	const name = "nftmarketplace/SetupUser";
	const signers = [account];

	return sendTransaction({ name, signers });
};

/*
 * Lists item with id equal to **item** id for sale with specified **price**.
 * @param {string} seller - seller account address
 * @param {UInt64} itemId - id of item to sell
 * @param {UFix64} price - price
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const createListing = async (seller, itemId, price) => {
	const name = "nftmarketplace/ListNFTForSale";
	const args = [itemId, price];
	const signers = [seller];

	return sendTransaction({ name, args, signers });
};

/*
 * Buys item with id equal to **item** id for **price** from **seller**.
 * @param {string} buyer - buyer account address
 * @param {UInt64} resourceId - resource uuid of item to sell
 * @param {string} seller - seller account address
 * @param {UInt64} royalty - royalty amount for creator
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const purchaseListing = async (buyer, resourceId, seller, royalty) => {
	const name = "nftmarketplace/PurchaseNFT";
	const args = [resourceId, seller, royalty];
	const signers = [buyer];

	return sendTransaction({ name, args, signers });
};

/*
 * Removes item with id equal to **item** from sale.
 * @param {string} owner - owner address
 * @param {UInt64} itemId - id of item to remove
 * @returns {Promise<[{*} txResult, {error} error]>}
 * */
export const removeListing = async (owner, itemId) => {
	const name = "nftmarketplace/UnlistNFTFromSale";
	const signers = [owner];
	const args = [itemId];

	return sendTransaction({ name, args, signers });
};

