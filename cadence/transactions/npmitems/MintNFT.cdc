import NPM from "../../NPM.cdc"

transaction(ipfsHash: String, metadata: {String: String}) {
    prepare(acct: AuthAccount) {
        let collection = acct.borrow<&NPM.Collection>(from: /storage/NFTCollection)
                            ?? panic("Failed to borrow: collection does not exist in storage")
        metadata.insert(key: "creator", acct.address.toString())
        let nft <- NPM.mintToken(ipfsHash: ipfsHash, metadata: metadata)
        collection.deposit(token: <- nft)
    }
    
    execute {
        log("Transaction executed: minted NFT in user account")
    }
}