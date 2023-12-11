const { ethers, artifacts} = require("hardhat");
const { expect } = require("chai");
const {
  expectEvent,
  expectRevert,
  time,
} = require("@openzeppelin/test-helpers");
const STOCKEN= artifacts.require("stockenCapital");

describe("NFT1155", () => {
  let admin;
  let alice;
  let bob;
  let random;

  let nft1155;
  
  before(async () => {
    [admin, alice, bob, random] = await ethers.getSigners();
    
    nft1155= await  STOCKEN.new({from:admin.address})
    await nft1155.initialize("uri",{from:admin.address})
   

    const NFT1155Art = artifacts.require("stockenCapital");
    nft1155 = await NFT1155Art.at(nft1155.address);

  });

  it("Should create NFT", async () => {
    let before = await nft1155.balanceOf(admin.address,1);
    const info= ethers.utils.formatBytes32String("Hola reina");
    await nft1155.createNewActivo([1,100],1,1,1,info,ethers.utils.parseEther("1"),{from: admin.address});
    let after = await nft1155.getActivosByUser(1);
    console.log(after[0].idUser)
    assert.ok(parseInt(before) === 0 && after[0].idUser.toString() === "1" && after[0].owner.toString()===nft1155.address)
    const tokenData= await nft1155.getActivo(1)
    console.log(tokenData)
  })

  it("Should not transfer  NFTs", async () => {
    await expectRevert(nft1155.safeTransferFrom(alice.address, bob.address, 1, ethers.utils.parseEther("1"), "0x", {from: admin.address}),"No se puede transferir");
  })
  it("Should mint 1 unit NFT", async () => {
    let before = await nft1155.balanceOf(alice.address,1);
    await nft1155.mintActivo(alice.address,1,{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,1);
    console.log(ethers.utils.formatEther(after.toString()),"this")
    assert.ok(ethers.utils.formatEther(after.toString()) === "1.0" && parseInt(before) === 0)
  })
  it("Should burn 1 unit NFT", async () => {
    let before = await nft1155.balanceOf(alice.address,1);
    await nft1155.burnIt(alice.address,1,{from: admin.address});
    let after = await nft1155.balanceOf(alice.address,1);
    assert.ok(ethers.utils.formatEther(before.toString()) === "1.0" && parseInt(after) === 0)
  })
  it("Should create  documents", async () => {
    await nft1155.createNewDocumento(1,ethers.utils.formatBytes32String("Hola reina"),1,{from: admin.address});
    const document= await nft1155.getDocumento(1);
    await nft1155.createNewDocumento(2,ethers.utils.formatBytes32String("Hola reina"),1,{from: admin.address});

    console.log("-----",document)

  })

    
});