import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import config from "../config";
import Head from 'next/head'

// import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
// import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      config.nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(
      config.nftaddress,
      NFT.abi,
      provider
    );
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  return (
    <div className="flex justify-center">
      <div className="bg-indigo"></div> 
      <div className="bg-angel"></div> 
      <div className="bg-greenvelvet"></div> 
      <div className="bg-pearlranger"></div> 
      <div className="bg-violetstorm"></div>
      <div className="bg-akira"></div>
      <div className="bg-forest"></div>
      <div className="bg-death"></div>
      <div className="bg-taffy"></div>
      <div className="bg-whitenight"></div>
      <div className="bg-bluepill"></div>
      <div className="bg-obedience"></div>
      <div className="bg-bananas"></div>
      <div className="bg-goldcharm"></div>
      <div className="bg-silvercharm"></div>
      <div className="bg-cherryblossom"></div>
      <div className="bg-zen"></div>
      <div className="bg-phoenixrising"></div>
      <div className="bg-militant"></div>
      <Head>
        <title>My Assets</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {nfts.map((nft, i) => (
            <div key={i} className="overflow-hidden rounded-xl border shadow">
              <img src={nft.image} className="rounded" />
              <div className="bg-black p-4">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} MATIC
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
