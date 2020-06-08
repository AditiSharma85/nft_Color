const ColorToken = artifacts.require('./ColorToken.sol');
require('chai')
	.use(require('chai-as-promised'))
	.should()
const truffleAssert = require('truffle-assertions');

contract('ColorToken',(accounts) => {
	let contract;

	before(async () => {
		contract = await ColorToken.deployed();
	})

describe('deployment',async() => {
	it('deploys successfully', async () => {
		contract = await ColorToken.deployed();
		const address = contract.address;
		console.log(address);
		assert.notEqual(address, '');
		assert.notEqual(address, 0x0);
		assert.notEqual(address, null);
		assert.notEqual(address, undefined);
	})

	it('has a name', async () => {
		const name = await contract.name();
		assert.equal(name, 'ColorToken');
	})

	it('has a symbol', async () => {
		const symbol = await contract.symbol();
		assert.equal(symbol, 'CT');
    })
    describe('minting', async() => {
        it('creates a new token', async () => {
            const checkBalance = await contract.balanceOf.call(accounts[0]);
            assert.equal(checkBalance,0,'Account balance is zero');
            const result = await contract.mint('#EC0588');
            const totalSupply = await contract.totalSupply();
            //SUCCESS
            assert.equal(totalSupply,1);
            console.log(result)
                       
        })
    })
    
})
})
