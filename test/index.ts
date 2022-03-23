import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");
    const market = await Market.deploy();
    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(marketAddress);
    await nft.deployed();
    const nftContractAddress = nft.address;

    const listingPrice = await market.getListingPrice();
    const listingPriceStr = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createToken("https://www.mytokenlocation.com");
    await nft.createToken("https://www.mytokenlocation2.com");

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPriceStr,
    });
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPriceStr,
    });

    const [_, buyerAddress, thirdAddress, fourthAddress] =
      await ethers.getSigners(); // first address is the seller

    await market
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    // lastly test querying for these items
    const items = await market.fetchMarketItems();
    const itemsMap = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        const item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
  });
});
