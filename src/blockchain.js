const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;//to generate public and private key to sign some block
const ec = new EC('secp256k1');
class Transactions{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress+ this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You Cannot sign Transactions');
        }
        
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');

    }

    isValid(){
        if(this.fromAddress == null) return true;

        if(!this.signature ||this.signature.length == 0 ){
            throw new Error('No Signature in this transaction');
        }
        const publicKey = ec.keyFromPublic(this.fromAddress,'hex');
        return publicKey.verify(this.calculateHash(),this.signature);
    }
}
class Block{
    constructor(timestamp,transactions,previousHash=''){
        this.timestamp=timestamp;
        //this.data=data;
        this.hash=this.calculateHash();
        this.previousHash = previousHash;
        this.nonce = 0;
        this.transactions = transactions;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty)!= Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }

    hasValidTransactions(){
        for (const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions=[];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        //returns the first block which means we have to hard code it for initializing puposes.
        return new Block("01/01/2022","Genesis Block","0");
    }

    getLatestBlock(){
        //returns latest block
        return this.chain[this.chain.length-1];
    }

    /*addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }*/

    minePendingTransactions(miningRewardAddress){
        const rewardTx = new Transactions(null,miningRewardAddress,this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log("Block Mined Successfully!!!");
        this.chain.push(block);

        this.pendingTransactions = [];
    }

    addTransactions(transactions){
        if(!transactions.fromAddress || !transactions.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if(!transactions.isValid()){
            throw new Error('Cannot add invalid transaction to the chain')
        }

        this.pendingTransactions.push(transactions);
    }

    getBalance(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    isChainVaid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

            if(currentBlock.previousHash!=prevBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.BlockChain = BlockChain;
module.exports.Transactions = Transactions;