const {BlockChain , Transactions} = require('./blockchain');
const EC = require('elliptic').ec;//to generate public and private key to sign some block
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('95a56f19b4fe066026786a27e6271a01aa975c1b66ae52fa1d929aec27622796');
const myWalletAddress = myKey.getPublic('hex');
let avijoyCoin = new BlockChain();

const tx1 = new Transactions(myWalletAddress,'publicKey Goes Here', 10);
tx1.signTransaction(myKey);
avijoyCoin.addTransactions(tx1);
//avijoyCoin.createTransactions(new Transactions('address1','address2',100));
//avijoyCoin.createTransactions(new Transactions('address1','address2',50));

console.log("Starting the miner");
//avijoyCoin.minePendingTransactions('demo-adress');
avijoyCoin.minePendingTransactions(myWalletAddress);


//console.log("Starting the miner");
//avijoyCoin.minePendingTransactions('demo-adress');

console.log("Balance Of demo is ",avijoyCoin.getBalance(myWalletAddress))
avijoyCoin.chain[1].transactions[0].amount =1;

console.log("Is our chain Valid ? ",avijoyCoin.isChainVaid())
//avijoyCoin.addBlock(new Block(1,"10/07/2022",{amount:4}))
//avijoyCoin.addBlock(new Block(1,"12/07/2022",{amount:10}))
//avijoyCoin.addBlock(new Block(1,"14/07/2022",{amount:4}))
//console.log(JSON.stringify(avijoyCoin,null,4));

//console.log("Is Block Chain Valid",avijoyCoin.isChainVaid());

//avijoyCoin.chain[1].data = {amount:100};
//avijoyCoin.chain[1].hash = avijoyCoin.chain[1].calculateHash();
//console.log("Is Block Chain Valid",avijoyCoin.isChainVaid());