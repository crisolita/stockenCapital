const { ethers, contract } = require("hardhat");
const { expect } = require("chai");

describe("NFT1155", () => {
  let admin;
  let alice;
  let bob;
  let random;

  let nft1155;
  
  before(async () => {
    [admin, alice, bob, random] = await ethers.getSigners();
    
    const NFT1155 = await ethers.getContractFactory("stockenCapital");
    nft1155 = await NFT1155.deploy("htttp://");
    await nft1155.deployed();

    const NFT1155Art = artifacts.require("stockenCapital");
    nft1155 = await NFT1155Art.at(nft1155.address);

  });

  it("Should create 1 unit NFT", async () => {
    let before = await nft1155.balanceOf(admin.address,1);
    await nft1155.mintNew(alice.address,1, 10,"my content","nft-hash-1",{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,1);
    assert.ok(parseInt(before) === 0 && parseInt(after) === 1)
  })


  it("Should burn 1 unit NFT", async () => {
    let before = await nft1155.balanceOf(alice.address,1);
    await nft1155.burnIt(alice.address,1,1,{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,1);
    assert.ok(parseInt(before) === 1 && parseInt(after) === 0)
  })

  it("Should create 10 units of NFTs", async () => {
    let before = await nft1155.balanceOf(alice.address,2);
    await nft1155.mintNew(alice.address,10, 10, "my content", "nft-hash-2",{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,2);
    assert.ok(parseInt(before) === 0 && parseInt(after) === 10)
  })

  it("Should burn 5 units of NFT", async () => {
    let before = await nft1155.balanceOf(alice.address,2);
    await nft1155.burnIt(alice.address,2,5,{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,2);
    assert.ok(parseInt(before) === 10 && parseInt(after) === 5)
  })

  it("Should transfer 3 units of NFTs", async () => {
    let balanceBefore = await nft1155.balanceOfBatch([alice.address,bob.address],[2,2]);
    await nft1155.safeTransferFrom(alice.address, bob.address, 2, 3, "0x", {from: admin.address});
    let balanceAfter = await nft1155.balanceOfBatch([alice.address,bob.address],[2,2]);
    assert.ok(parseInt(balanceBefore[0]) === 5 && parseInt(balanceBefore[1]) === 0 && parseInt(balanceAfter[0])=== 2 && parseInt(balanceAfter[1]) === 3)
  })

  it("Should create 10 units of 2 types of NFTs", async () => {
    let before1 = await nft1155.balanceOf(alice.address,3);
    await nft1155.mintNew(alice.address,10, 10, "my content", "nft-hash-2",{from: admin.address});
    let after1 = await nft1155.balanceOf(alice.address,3);
    let before2 = await nft1155.balanceOf(alice.address,4);
    await nft1155.mintNew(alice.address,10, 10, "my content", "nft-hash-3",{from: admin.address});
    let after2 = await nft1155.balanceOf(alice.address,4);
    assert.ok(parseInt(before1) === 0 && parseInt(after1) === 10 && parseInt(before2) === 0 && parseInt(after2) === 10)
  })

  it("Should transfer 5 units of 2 types of NFT on batch", async () => {
    let balanceBefore = await nft1155.balanceOfBatch([alice.address,alice.address,bob.address,bob.address],[3,4,3,4]);
    await nft1155.safeBatchTransferFrom(alice.address, bob.address, [3,4], [5,5], "0x", {from: admin.address});
    let balanceAfter = await nft1155.balanceOfBatch([alice.address,alice.address,bob.address,bob.address],[3,4,3,4]);
    assert.ok(parseInt(balanceBefore[0]) === 10 && parseInt(balanceBefore[1]) === 10 && parseInt(balanceBefore[2]) === 0 && parseInt(balanceBefore[3]) === 0 && parseInt(balanceAfter[0])=== 5 && parseInt(balanceAfter[1]) === 5 && parseInt(balanceAfter[2])=== 5 && parseInt(balanceAfter[3]) === 5)
  })
    
});