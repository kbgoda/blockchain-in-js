const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
// Convert to typescript when project finished in JS
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
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
        this.chain = [this.createGenesisBlock()]; // Empty chain
        this.difficulty = 2; // This difficulty allows us to control how fast blocks are added to the network
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block Successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [ new Transaction(null, miningRewardAddress, this.miningReward) ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        // Loop entire blockchain
        for(const block of this.chain) {
            // Loop the transactions inside each block
            for(const tx of block.transactions) {
                if(tx.fromAddress === address) {
                    balance -= tx.amount;
                }

                if(tx.toAddress === address) {
                    balance += tx.amount;
                }

            }
        }
        return balance;
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

kCoin.createTransaction(new Transaction('address1', 'address2', 100));
kCoin.createTransaction(new Transaction('address1', 'address2', 50));

console.log('\nStarting the miner');
kCoin.minePendingTransactions('bob-address');
console.log('Balance of Bob is: ' + kCoin.getBalanceOfAddress('bob-address'));

console.log('\nStarting the miner again');
kCoin.minePendingTransactions('bob-address');
console.log('Balance of Bob is: ' + kCoin.getBalanceOfAddress('bob-address'));
