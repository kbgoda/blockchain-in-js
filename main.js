// Convert to typescript when project finished in JS
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = ''; // Hash will be set later
    }

    calculateHash() {
        
    }
}