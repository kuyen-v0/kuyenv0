import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Link from 'next/link'
import Moralis from "moralis"


import config from '../config';

import GalleryItem from '../components/GalleryItem';

// import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
// import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

console.log(`${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);
//const server_url = process.env.MORALIS_SERVER_URL;
//const app_id = process.env.MORALIS_APP_ID;
//Moralis.start({server_url, app_id});

const collectionContracts = ['0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d'];

export async function getStaticProps() {
  const holders = [...Array(30).keys()];
    //console.log(NFTs.result[0]);
    let items = await Promise.all(holders.map(async i => {
      const meta = await web3.alchemy.getNftMetadata({
        contractAddress: collectionContracts[0],
        tokenId: (i+1).toString()
      });  
      let price = 0
      let item = {
        price,
        tokenAddr: collectionContracts[0],
        tokenId: parseInt(meta.id.tokenId),
        image: meta.metadata.image,
        name: meta.title,
        description: meta.description,
      };
      return item;
    }));
    let result = items.filter(item => item.image !== undefined)
    result = result.map(item => {
      item.image = "http://cloudflare-ipfs.com/ipfs/" + item.image.slice(7);
      return item;
    })
    //const nftOwners = await Moralis.Web3API.token.getNFTOwners({chain: "eth", address: collectionContracts[0]});
    //let total = nftOwners.total;


  return {
    props: {
      result,
      //total
    }
  }
}


export default function Gallery ({ result, items }) {
  const [listedNfts, setListedNfts] = useState([])
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadCollectionNFTs(result);
    setTotal(items);
  })

  async function loadCollectionNFTs(altItems) {
    setCollectionNfts(altItems);
    setLoadingState('loaded');
  }
  
  

  return (
    <div className="flex-col justify-center">
      <h2 className="text-center">GALLERY</h2>
      <div className="flex border text-center content-center justify-center">
        <div className="box-sizing border-right border-gray-200 ">
          <span className="mb-5px text-xl">8.0k</span>
          <span className="block mb-3px text-l mx-8">items</span>
        </div>
        <div className="border">
          <span className="mb-5px text-xl">4.0k</span>
          <span className="block mb-3px text-l">owners</span>
        </div>

      </div>
      <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            collectionNfts.map((nft, i) => (
              <Link key={i} href={`collection/${nft.tokenAddr}/${nft.tokenId}`}>
                <a><GalleryItem nft={nft} /></a>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  );
}

