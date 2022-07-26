import NonFungibleToken from "./NonFungibleToken"

pub contract NPM: NonFungibleToken {
    pub var totalSupply: UInt64
    
    // These will be used in the Marketplace to pay out 
    // royalties to the creator and to the marketplace
    access(account) var royaltyCut: UFix64
    access(account) var marketplaceCut: UFix64

    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub event NFTCreated(id: UInt64)

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let ipfsHash: String
        pub var metadata: {String: String}

        init(ipfsHash: String,  metadata: {String: String}) {
            NPM.totalSupply = NPM.totalSupply + 1
            self.id = NPM.totalSupply
            self.ipfsHash = ipfsHash
            self.metadata = metadata

            emit NFTCreated(id: self.id)
        }
    }

    pub resource interface CollectionPublic {
        pub fun borrowEntireNFT(id: UInt64): &NPM.NFT
    }

    pub resource Collection: NonFungibleToken.Receiver, NonFungibleToken.Provider, NonFungibleToken.CollectionPublic, CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init() {
            self.ownedNFTs <- {}
        }

        destroy() {
            destroy self.ownedNFTs
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            pre {
                self.owner?.address != nil:
                    "can not deposit because owner does not exist."
            }
            let t <- token as! @NPM.NFT
            emit Deposit(id: t.id, to: self.owner?.address)
            self.ownedNFTs[t.id] <-! t
        }

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            pre {
                self.owner?.address != nil:
                    "can not withdraw because owner does not exist."
            }
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("The NFT does not exist")
            emit Withdraw(id: token.id, from: self.owner?.address)
            return <- token
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }

        pub fun borrowEntireNFT(id: UInt64): &NPM.NFT {
            let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
            return ref as! &NPM.NFT
        }
    }

    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    pub fun mintToken(ipfsHash: String, metadata: {String: String}): @NPM.NFT {
        return <- create NFT(ipfsHash: ipfsHash, metadata: metadata)
    }

    // These functions will return the current Royalty cuts for 
    // both the Creator and the Marketplace.
    pub fun getRoyaltyCut(): UFix64{
        return self.royaltyCut
    }
    pub fun getMarketplaceCut(): UFix64{
        return self.marketplaceCut
    }
    
    // Only Admins will be able to call the set functions to 
    // manage Royalties and Marketplace cuts.
    access(account) fun setRoyaltyCut(value: UFix64){
        self.royaltyCut = value
    }
    access(account) fun setMarketplaceCut(value: UFix64){
        self.marketplaceCut = value
    }

    init() {
        self.totalSupply = 0

        // Set the default Royalty and Marketplace cuts
        self.royaltyCut = 0.01
        self.marketplaceCut = 0.05
    }
}