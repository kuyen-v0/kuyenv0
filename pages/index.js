import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Link from "next/link";
import Moralis from "moralis";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";

import config from "../config";

// import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
// import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

console.log(`${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);
// const server_url = process.env.MORALIS_SERVER_URL;
// const app_id = process.env.MORALIS_APP_ID;
// Moralis.start({server_url, app_id});

const collectionContracts = ["0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d"];

export async function getStaticProps() {
  const holders = [...Array(30).keys()];
  // console.log(NFTs.result[0]);
  const items = await Promise.all(
    holders.map(async (i) => {
      const meta = await web3.alchemy.getNftMetadata({
        contractAddress: collectionContracts[0],
        tokenId: (i + 1).toString(),
      });
      const price = 0;
      const item = {
        price,
        tokenAddr: collectionContracts[0],
        tokenId: parseInt(meta.id.tokenId),
        image: meta.metadata.image,
        name: meta.title,
        description: meta.description,
      };
      return item;
    })
  );
  let result = items.filter((item) => item.image !== undefined);
  result = result.map((item) => {
    item.image = "http://cloudflare-ipfs.com/ipfs/" + item.image.slice(7);
    return item;
  });
  // const nftOwners = await Moralis.Web3API.token.getNFTOwners({chain: "eth", address: collectionContracts[0]});
  // let total = nftOwners.total;

  return {
    props: {
      result,
      // total
    },
  };
}

export default function Gallery({ result, items }) {
  const [listedNfts, setListedNfts] = useState([]);
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [hasMore, setHasMore] = useState(true);
  const [subset, setSubset] = useState([]);

  useEffect(() => {
    loadCollectionNFTs(result);
    setTotal(items);
  }, []);

  async function loadCollectionNFTs(altItems) {
    setCollectionNfts(altItems);
    setSubset(altItems.slice(0, 4));
    setLoadingState("loaded");
  }

  const getMoreListings = () => {
    if (subset.length === collectionNfts.length) {
      setHasMore(false);
    }
    setSubset(collectionNfts.slice(0, subset.length + 4));
  };

  const parseNFTName = (nftName) => {
    const listOfWords = nftName.split("#");
    const nftCollectionName = listOfWords.slice(0, 2);
    const nftCollectionNumber = listOfWords.slice(2, 6);
    return [nftCollectionName, nftCollectionNumber];
  };

  return (
    <div className="flex-col justify-center">
      <Head>
        <title>NFT Gallery</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <br />
      <h1 className="text-center text-5xl font-semibold leading-normal subpixel-antialiased">
        GALLERY
      </h1>
      <div className="flex content-center justify-center border text-center">
        <div className=" box-sizing border-right border border-gray-200">
          <span className="mb-5px font-serif text-4xl">8.0k</span>
          <span className="mb-3px text-l mx-8 block font-mono">items</span>
        </div>
        <div className="box-sizing border-right border border-gray-200">
          <span className="mb-5px font-serif text-4xl">4.0k</span>
          <span className="mb-3px text-l mx-8 block font-mono">owners</span>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="px-4" style={{ maxWidth: "1600px" }}>
          <InfiniteScroll
            dataLength={subset.length}
            next={getMoreListings}
            hasMore={hasMore}
            loader={<h3> Collection Loading...</h3>}
            endMessage={<h4></h4>}
          >
            <br />
            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
              {subset.map((nft, i) => (
                <Link
                  key={i}
                  href={`collection/${nft.tokenAddr}/${nft.tokenId}`}
                >
                  <div>
                    <div className="rounded-full border border-gray-200 hover:scale-105 hover:border-black">
                      <img
                        alt=""
                        loading="lazy"
                        width="100%"
                        height="100%"
                        className="rounded-full hover:scale-105"
                        src={nft.image}
                      />
                    </div>
                    <br />
                    <div>
                      <p className="mt-0.5 text-center">
                        {parseNFTName(nft.name)[0][0]}
                      </p>
                    </div>
                    <div>
                      <p className="mt-0.5 text-center">
                        {"NO . " + parseNFTName(nft.name)[0][1]}
                      </p>
                    </div>
                    <br />
                  </div>
                </Link>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
