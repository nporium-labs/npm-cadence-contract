
import NonFungibleToken from "../../contracts/NonFungibleToken.cdc"
import NPM from "../../contracts/NPM.cdc"

pub fun main(account: Address): [&NPM.NFT] {
  let collection = getAccount(account).getCapability(/public/NFTCollection)
                    .borrow<&NPM.Collection{NonFungibleToken.CollectionPublic, NPM.CollectionPublic}>()
                    ?? panic("Failed to get user's collection.")
  let res: [&NPM.NFT] = []
  let ids = collection.getIDs()
  for id in ids {
    res.append(collection.borrowEntireNFT(id: id))
  }
  return res
}