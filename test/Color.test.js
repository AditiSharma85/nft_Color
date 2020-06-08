const ColorToken = artifacts.require("./ColorToken.sol");
require("chai").use(require("chai-as-promised")).should();
const truffleAssert = require("truffle-assertions");

contract("ColorToken", (accounts) => {
  let contract;
  let erc721Id = "0x80ac58cd";

  before(async () => {
    contract = await ColorToken.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      contract = await ColorToken.deployed();
      const address = contract.address;
      console.log(address);
      assert.notEqual(address, "");
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
    describe("ERC 721 compliance", async () => {
      it("Compiles to ERC721 token standards", async () => {
        const erc721Complied = await contract.supportsInterface.call(erc721Id);
        assert.equal(
          erc721Complied,
          true,
          "ColorToken is compliant with ERC721 standards"
        );
      });
    });

    it("has a name", async () => {
      const name = await contract.name();
      assert.equal(name, "ColorToken");
    });

    it("has a symbol", async () => {
      const symbol = await contract.symbol();
      assert.equal(symbol, "CT");
    });
    describe("minting", async () => {
      it("creates a new token", async () => {
        const checkBalance = await contract.balanceOf.call(accounts[0]);
        assert.equal(checkBalance, 0, "Account balance is zero");
        const result = await contract.mint("#EC0588");
        const totalSupply = await contract.totalSupply();
        //SUCCESS
        assert.equal(totalSupply, 1);
        const event = result.logs[0].args;
        assert.equal(event.tokenId.toNumber(), 0, "id is correct");
        assert.equal(
          event.from,
          "0x0000000000000000000000000000000000000000",
          "from is correct"
        );
        assert.equal(event.to, accounts[0], "to is correct");
        //FAILURE: cannot mint same color again
        await contract.mint("#EC0588").should.be.rejected;
      });
    });
    describe("indexing", async () => {
      it("lists colors", async () => {
        //Mint 3 more Tokens
        await contract.mint("#EC0600");
        await contract.mint("#FFFFFF");
        await contract.mint("#000000");
        const totalSupply = await contract.totalSupply();
        let color;
        let result = [];

        for (var i = 1; i <= totalSupply; i++) {
          color = await contract.colors(i - 1);
          result.push(color);
        }
        let expected = ["#EC0588", "#EC0600", "#FFFFFF", "#000000"];
        assert.equal(result.join(","), expected.join(","));
      });
    });
    describe("balanceOf test", async () => {
      it("to check balance for minter and non minter", async () => {
        //Minter Balance = 4 due to minting in earlier test.
        const balanceOfMinter = await contract.balanceOf.call(accounts[0]);
        assert.equal(balanceOfMinter, 4, "Balance of Minter as expected");
      });
      it("Zero balance for a non minter ", async () => {
        //Non-Minter balance = 0 Not yet minted.
        const balanceofNonMinter = await contract.balanceOf(accounts[1]);
        assert.equal(
          balanceofNonMinter,
          0,
          "Balance of Non Minter is as expected"
        );
      });
    });
    describe("ownerOf test", async () => {
      it("to check for the correct owner", async () => {
        //Owner should be identified for minted token id
        const ownerOf = await contract.ownerOf.call(3);
        assert.equal(
          ownerOf,
          accounts[0],
          "Owner as expected for exisiting token id"
        );
      });
      it("No owner for non minted token id", async () => {
        //No Owner for non minted token id
        await contract.ownerOf.call(11).should.be.rejected;
      });
    });
    describe("approve test", async () => {
      it("Set transaction approval to some address", async () => {
        const approve = await contract.approve(accounts[1], 3, {
          from: accounts[0],
        });
        const setAddress = await contract.getApproved.call(3);
        assert.equal(
          accounts[1],
          setAddress,
          "Address approved for transaction approval"
        );
      });

      it("No approval if the approving address is not of the owner or already approved address", async () => {
        await truffleAssert.reverts(
          contract.approve(accounts[5], 3, { from: accounts[5] }),
          "approve caller is not owner nor approved for all"
        );
      });
    });
    describe("getApproved test", async () => {
      it("Fetch approval info for a token id", async () => {
        const approve = await contract.approve(accounts[1], 3, {
          from: accounts[0],
        });
        const approvedAddress = await contract.getApproved.call(3);
        assert.equal(
          approvedAddress,
          accounts[1],
          "Fetched Approval address as expected"
        );
      });

      it("Should not fetch approval info for nonexistent token id ", async () => {
        await truffleAssert.reverts(
          contract.getApproved.call(11),
          "approved query for nonexistent token"
        );
      });
    });
    describe("setApprovalForAll test", async () => {
      it("to check if event emitted for setApprovalForAll", async () => {
        //gets Approved Address for exisitng token id
        const setApprovalForAll = await contract.setApprovalForAll(
          accounts[1],
          true
        );
        truffleAssert.eventEmitted(setApprovalForAll, "ApprovalForAll");
      });
      it("to check if approving your own account", async () => {
        //reverts for self approval
        await contract.setApprovalForAll(accounts[0], true).should.be.rejected;
      });
    });
    describe("transferFrom test", async()=>{
        it("tests the transferFrom function", async () => {
            await contract.mint("#FFF444");
            await contract.transferFrom(accounts[0], accounts[1], 4);
            const ApprovedOwner = await contract.ownerOf.call(4);
            assert.equal(ApprovedOwner, accounts[1], "Owner verified");
          })
        })
    describe("safeTransferFrom test", async=>{
        it('Ensures safe Transfers by verifying owner', async() => {
            const owner1 = await contract.ownerOf.call(0);
            assert.equal(owner1,accounts[0],'Token owner verified');
            await contract.safeTransferFrom(accounts[0],accounts[1],3);
            const owner2 = await contract.ownerOf.call(3);
            assert.equal(owner2,accounts[1],'Token safely transferred');
        })
      })
  })
})
