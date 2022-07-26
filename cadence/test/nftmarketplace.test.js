import path from "path";

import { 
	emulator,
	init,
	getAccountAddress,
	shallPass,
	mintFlow,
} from "flow-js-testing";

import { toUFix64 } from "../src/common";
import { 
	mintNpmItem,
} from "../src/npmitems";
import {
	deployNFTStorefront,
	createListing,
	purchaseListing,
	removeListing,
	setupStorefrontOnAccount,
	getListingCount,
} from "../src/nftmarketplace";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(500000);

describe("NFT Storefront", () => {
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../");
		const port = 7003;
		await init(basePath, { port });
		await emulator.start(port, false);
		return await new Promise(r => setTimeout(r, 1000));
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		await emulator.stop();
		return await new Promise(r => setTimeout(r, 1000));
	});

	it("should deploy NFTStorefront contract", async () => {
		await shallPass(deployNFTStorefront());
	});

	it("should be able to create an empty Storefront", async () => {
		// Setup
		await deployNFTStorefront();
		const Alice = await getAccountAddress("Alice");

		await shallPass(setupStorefrontOnAccount(Alice));
	});

    it("should be able to accept a listing", async () => {
		// Setup
		await deployNFTStorefront();

		// Setup seller account
		const Alice = await getAccountAddress("Alice");
		await setupStorefrontOnAccount(Alice);
		await mintNpmItem(Alice, types.fishbowl, rarities.blue);

		const itemId = 0;

		// Setup buyer account
		const Bob = await getAccountAddress("Bob");
		await setupStorefrontOnAccount(Bob);

		await shallPass(mintFlow(Bob, toUFix64(100)));

		// Bob shall be able to buy from Alice
		const [sellItemTransactionResult] = await shallPass(createListing(Alice, itemId, toUFix64(1.11)));
		const listingAvailableEvent = sellItemTransactionResult.events[0];
		const listingResourceID = listingAvailableEvent.data.listingResourceID;
        const royalty = "15";
		await shallPass(purchaseListing(Bob, listingResourceID, Alice, royalty));

		const [listingCount] = await getListingCount(Alice);
		expect(listingCount).toBe(0);
	});
});
