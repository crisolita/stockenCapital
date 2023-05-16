const { ethers, contract } = require("hardhat");
const { expect } = require("chai");
const {
  expectEvent,
  expectRevert,
  time,
} = require("@openzeppelin/test-helpers");

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

  it("Should create NFT", async () => {
    let before = await nft1155.balanceOf(admin.address,1);
    const info= ethers.utils.formatBytes32String("Hola reina");
    await nft1155.createNewActivo(alice.address,1,1,info,"nft-hash-1",{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,1);
    assert.ok(parseInt(before) === 0 && ethers.utils.formatEther(after.toString()) === "1.0")
    const tokenData= await nft1155.getActivo(1)
    console.log(tokenData)
  })

  it("Should not transfer  NFTs", async () => {
    await expectRevert(nft1155.safeTransferFrom(alice.address, bob.address, 1, ethers.utils.parseEther("1"), "0x", {from: admin.address}),"No se puede transferir");
  })
  it("Should burn 1 unit NFT", async () => {
    let before = await nft1155.balanceOf(alice.address,1);
    await nft1155.burnIt(alice.address,1,{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,1);
    assert.ok(ethers.utils.formatEther(before.toString()) === "1.0" && parseInt(after) === 0)
  })
  it("Should create  documents", async () => {
    await nft1155.createNewDocumento(alice.address,[2],ethers.utils.formatBytes32String("Hola reina"),1,{from: admin.address});
    const document= await nft1155.getDocumento(1);
    const documentsByUser= await nft1155.getDocumentosByUser(2)
    await nft1155.createNewDocumento(bob.address,[3],ethers.utils.formatBytes32String("Hola reina"),1,{from: admin.address});
    console.log("----",documentsByUser)
    const documentsByUserBOB= await nft1155.getDocumentosByUser(3)

    console.log("-----",document)
    console.log("----",documentsByUserBOB)

  })

    
});