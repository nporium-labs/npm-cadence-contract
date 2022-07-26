import NPM from "../../contracts/NPM.cdc"

// This scripts returns the number of NPM currently in existence.

pub fun main(): UInt64 {    
    return NPM.totalSupply
}
