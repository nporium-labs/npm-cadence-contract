import NonFungibleToken from "../../NonFungibleToken.cdc"
import NPM from "../../NPM.cdc"
import FungibleToken from "../../FungibleToken.cdc"
import FlowToken from "../../FlowToken.cdc"
import NFTMarketplace from "../../NFTMarketplace.cdc"

transaction {
    prepare(acct: AuthAccount) {
        // Set up collection
        acct.save(<- NPM.createEmptyCollection(), to: /storage/NFTCollection)
        acct.link<&NPM.Collection{NPM.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/NFTCollection, target: /storage/NFTCollection)
        acct.link<&NPM.Collection>(/private/NFTCollection, target: /storage/NFTCollection)

        // Set up sale collection
        let collection = acct.getCapability<&NPM.Collection>(/private/NFTCollection)
        let vault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        acct.save(<- NFTMarketplace.createSaleCollection(NFTCollection: collection, FlowTokenVault: vault), to: /storage/SaleCollection)
        acct.link<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>(/public/SaleCollection, target: /storage/SaleCollection)
    }

    execute {
        log("Transaction executed: collection and sale collection has been set up for user account")
    }
}