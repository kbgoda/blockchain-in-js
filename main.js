const SHA256 = require('crypto-js/sha256');

// Convert to typescript when project finished in JS
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash(); // Hash will be set later
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Implementing POW
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;    
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    
    constructor() {
        // Chain is an array of blocks
        this.chain = [this.createGenesisBlock]; // Empty chain
        this.difficulty = 5; // This difficulty allows us to control how fast blocks are added to the network
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
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

            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let kCoin = new Blockchain();

console.log("Mining first block\n");
kCoin.addBlock(new Block(1, "10/072017", {amount: 4}));
console.log("Mining second block\n");
kCoin.addBlock(new Block(2, "11/072017", {amount: 8}));
console.log("Mining third block\n");
kCoin.addBlock(new Block(3, "12/072017", {amount: 12}));

console.log("\nIs chain valid: " + kCoin.isChainValid() + "\n");

var whitespace = 4;
var replacer = null;
console.log(JSON.stringify(kCoin, replacer, whitespace));

// Now we will contaminate blockchain
// kCoin.chain[1].data = {amount: 20}; // Now the hash of index 1's block will be different compared to index 2 previous hash's
// console.log("\nIs chain valid: " + kCoin.isChainValid());

