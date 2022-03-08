//import { ethers } from "ethers";
import { useEffect, useState } from "react";
//import axios from "axios";
//import Web3Modal from "web3modal";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Link from "next/link";
//import Moralis from "moralis";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";

import GalleryItem from "../components/GalleryItem";
import FilterSelector from "../components/FilterSelector";

import {script} from './create-filters-script';

// import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
// import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

console.log(`${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);
// const server_url = process.env.MORALIS_SERVER_URL;
// const app_id = process.env.MORALIS_APP_ID;
// Moralis.start({server_url, app_id});

const collectionContracts = ["0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d"]

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
    setSubset(altItems.slice());
    setLoadingState("loaded");
  }

  const getMoreListings = () => {
    if (subset.length === collectionNfts.length) {
      setHasMore(false);
    }
    setSubset(collectionNfts.slice(0, subset.length + 4));
  };

  const handleSearchFilter = (e) => {
    e.preventDefault();
    const filteredArray = collectionNfts.filter((nft) =>
      nft.name.split("#")[1].includes(e.target.filter.value)
    );
    setSubset(filteredArray);
  };

  const handleDropdownFilter = (e) => {
    const selectedValue = e.value;

    if (selectedValue === "lowhigh") {
      collectionNfts.sort((a, b) => {
        return a.price - b.price;
      });
      setSubset(collectionNfts);
    } else if (selectedValue === "highlow") {
      collectionNfts.sort((a, b) => {
        return b.price - a.price;
      });
    } else {
      setSubset(collectionNfts.reverse());
    }
  };

  return (
    <div className="flex-col justify-center">
      <Head>
        <title>NFT Gallery</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <br />
      <br />


      <div className='flex'>

        <div className='w-96 mx-4'>
          <div className="flex items-end">
            <h2 className="text-2xl font-bold text-yellow-300">FILTER</h2>
            <h1 className="mx-2 text-2xl font-bold text-yellow-300">//</h1>
          </div>
          <br />
          <FilterSelector />
        </div>

        <div>
          <div className="flex items-end px-4">
            <h2 className="text-2xl font-bold text-yellow-300">GALLERY</h2>
            <h1 className="mx-2 text-2xl font-bold text-yellow-300">//</h1>
            <p className="mb-5px mx-2 text-lg text-yellow-300">8.0k items</p>
            <p className="mb-5px text-lg text-yellow-300">4.0k owners</p>
          </div>
          <br />

          <div className="ml-4 mr-4 flex items-center justify-start">
            <form onSubmit={handleSearchFilter}>
              <div className="flex rounded border-2">
                <input
                  type="text"
                  id="filter"
                  name="filter"
                  className="w-80 px-4 py-2"
                  placeholder="Search..."
                />
                <button
                  type="submit"
                  className="flex items-center justify-center border-l px-4"
                >
                  <svg
                    className="h-6 w-6 text-gray-600"
                    fill="yellow"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="ml-6 flex rounded border-2">
              <select
                className="form-select dropdown relative block w-full w-80 px-4 py-2"
                name="price"
                id="price"
                onChange={handleDropdownFilter}
              >
                <option value="lowhigh">Price: Low To High</option>
                <option value="highLow">Price: High To Low</option>
                <option value="recentlyListed">Recently Listed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <div style={{ maxWidth: "1600px" }}>
              <InfiniteScroll
                dataLength={subset.length}
                next={getMoreListings}
                hasMore={hasMore}
                loader={<h3> Collection Loading...</h3>}
                endMessage={<h4></h4>}
              >
                <br />
                <div className="grid grid-cols-1 gap-4 p-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  {subset.map((nft, i) => (
                    <Link
                      key={i}
                      href={`collection/${nft.tokenAddr}/${nft.tokenId}`}
                    >
                      <a>
                        <GalleryItem nft={nft} />
                      </a>
                    </Link>
                  ))}
                </div>
              </InfiniteScroll>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
