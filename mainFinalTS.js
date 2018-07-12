"use strict";
exports.__esModule = true;
// const SHA256 = import('crypto-js/sha256');
// import { SHA256 } from 'crypto-js/sha256';
// let sha256 = new SHA256();
// import * as sha256 from "fast-sha256";
var js_sha256_1 = require("js-sha256");
var Transaction = /** @class */ (function () {
    function Transaction(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
    return Transaction;
}());
// Convert to typescript when project finished in JS
var Block = /** @class */ (function () {
    function Block(timestamp, transactions, previousHash) {
        if (previousHash === void 0) { previousHash = ''; }
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    Block.prototype.calculateHash = function () {
        return js_sha256_1.sha256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
        // return sha256("1");\
    };
    // Implementing POW
    Block.prototype.mineBlock = function (difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    };
    return Block;
}());
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        // Chain is an array of blocks
        this.chain = [this.createGenesisBlock()]; // Empty chain
        this.difficulty = 2; // This difficulty allows us to control how fast blocks are added to the network
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    Blockchain.prototype.createGenesisBlock = function () {
        return new Block(Date.parse("2017-01-01"), [], "0");
    };
    Blockchain.prototype.getLatestBlock = function () {
        return this.chain[this.chain.length - 1];
    };
    Blockchain.prototype.minePendingTransactions = function (miningRewardAddress) {
        var block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log('Block Successfully mined!');
        this.chain.push(block);
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    };
    Blockchain.prototype.createTransaction = function (transaction) {
        this.pendingTransactions.push(transaction);
    };
    Blockchain.prototype.getBalanceOfAddress = function (address) {
        var balance = 0;
        // Loop entire blockchain
        for (var _i = 0, _a = this.chain; _i < _a.length; _i++) {
            var block = _a[_i];
            // Loop the transactions inside each block
            for (var _b = 0, _c = block.transactions; _b < _c.length; _b++) {
                var tx = _c[_b];
                if (tx.fromAddress === address) {
                    balance -= tx.amount;
                }
                if (tx.toAddress === address) {
                    balance += tx.amount;
                }
            }
        }
        return balance;
    };
    Blockchain.prototype.isChainValid = function () {
        // We don't check the genesis block (index 0)
        for (var i = 1; i < this.chain.length; i++) {
            var currentBlock = this.chain[i];
            var previousBlock = this.chain[i - 1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    };
    return Blockchain;
}());
var kCoin = new Blockchain();
kCoin.createTransaction(new Transaction('address1', 'address2', 100));
kCoin.createTransaction(new Transaction('address1', 'address2', 50));
console.log('\nStarting the miner');
kCoin.minePendingTransactions('bob-address');
console.log('Balance of Bob is: ' + kCoin.getBalanceOfAddress('bob-address'));
console.log('\nStarting the miner again');
kCoin.minePendingTransactions('bob-address');
console.log('Balance of Bob is: ' + kCoin.getBalanceOfAddress('bob-address'));
