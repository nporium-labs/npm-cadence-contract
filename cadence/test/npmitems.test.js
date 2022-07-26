import path from "path";

import { 
	emulator,
	init,
	getAccountAddress,
	shallPass,
	shallResolve,
} from "flow-js-testing";

import { getNpmAdminAddress } from "../src/common";
import {
	deployNpmItems,
	getNpmItemSupply,
	mintNpmItem,
	setupNpmItemsOnAccount,
} from "../src/npmitems";

// We need to set timeout for a higher number, because some transactions might take up some time
jest.setTimeout(50000);

describe("Npm Items", () => {
	// Instantiate emulator and path to Cadence files
	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../../");
		const port = 7002;
		await init(basePath, { port });
		await emulator.start(port, false);
		return await new Promise(r => setTimeout(r, 1000));
	});

	// Stop emulator, so it could be restarted
	afterEach(async () => {
		await emulator.stop();
		return await new Promise(r => setTimeout(r, 1000));
	});

	it("should deploy NpmItems contract", async () => {
		await shallPass(deployNpmItems());
	});

	it("supply should be 0 after contract is deployed", async () => {
		// Setup
		await deployNpmItems();
		const NpmAdmin = await getNpmAdminAddress();
		await shallPass(setupNpmItemsOnAccount(NpmAdmin));

		const [supply] = await shallResolve(getNpmItemSupply())
		expect(supply).toBe(0);
	});

	it("should be able to mint a NPM item", async () => {
		// Setup
		await deployNpmItems();
		const Alice = await getAccountAddress("Alice");
		await setupNpmItemsOnAccount(Alice);

		// Mint instruction for Alice account shall be resolved
		await shallPass(mintNpmItem(Alice, types.fishbowl, rarities.blue));
	});
});
