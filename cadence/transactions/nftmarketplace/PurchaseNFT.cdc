import NonFungibleToken from "../../NonFungibleToken.cdc"
import NPM from "../../NPM.cdc"
import FlowToken from "../../FlowToken.cdc"
import NFTMarketplace from "../../NFTMarketplace.cdc"

transaction(account: Address, id: UInt64, account: creator, creatorRoyalty: UInt64) {
    prepare(acct: AuthAccount) {
        let saleCollection = getAccount(account).getCapability(/public/SaleCollection)
                        .borrow<&NFTMarketplace.SaleCollection{NFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Failed to borrow user's SaleCollection")
        let recipientCollection = getAccount(acct.address).getCapability(/public/NFTCollection) 
                        .borrow<&NPM.Collection{NonFungibleToken.CollectionPublic}>()
                        ?? panic("Failed to get User's collection.")
        let price = saleCollection.getPrice(id: id)
        let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault
        saleCollection.purchaseNFT(id: id, creator: Address, creatorRoyalty: UInt64, recipientCollection: recipientCollection, account: creatorRoyalty, payment: <- payment)
    }
    
    execute {
        log("Transaction executed: purchased NFT")
    }
}