const SHA256 = require('crypto-js/sha256');

// Convert to typescript when project finished in JS
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = ''; // Hash will be set later
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    
    constructor() {
        // Chain is an array of blocks
        this.chain = [this.createGenesisBlock]; // Empty chain
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        // We don't check the genesis block (index 0)
        for(var i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.calculateHash) {
                return false;
            }

            return true;
        }
    }
}

let kCoin = new Blockchain();
kCoin.addBlock(new Block(0, "10/072017", {amount: 4}));
kCoin.addBlock(new Block(1, "11/072017", {amount: 8}));
kCoin.addBlock(new Block(2, "12/072017", {amount: 12}));

console.log("\nIs chain valid: " + kCoin.isChainValid() + "\n");

var whitespace = 4;
var replacer = null;
console.log(JSON.stringify(kCoin, replacer, whitespace));

// Now we will contaminate blockchain
// kCoin.chain[1].data = {amount: 20}; // Now the hash of index 1's block will be different compared to index 2 previous hash's
// console.log("\nIs chain valid: " + kCoin.isChainValid());

