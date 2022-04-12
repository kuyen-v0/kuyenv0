import { useEffect, useState } from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";
import clientPromise from "../lib/mongodb";

import GalleryItem from "../components/GalleryItem";
import FilterSelector from "../components/FilterSelector";
import PageTemplate from "../components/PageTemplate";
import { FilterPills } from "../components/FilterPill";
import useSWR from "swr";

// console.log(`${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);
// const server_url = process.env.MORALIS_SERVER_URL;
// const app_id = process.env.MORALIS_APP_ID;
// Moralis.start({server_url, app_id});

//const collectionContracts = ["0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d"];

const fetcher = async (url, filterData) => {
  console.log(filterData);
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  if (res.status !== 200) {
    throw new Error(data.error);
  }
  return data;
};

export async function getStaticProps() {
  let collectionId = process.env.TOKEN_CONTRACT;
  collectionId = "0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d";
  //get total, placeholder for now
  //const querySnapshot = await getDocs(collection(db, collectionId, "NFTData", "NFTs"));
  //const collectionSize = querySnapshot.length;

  let traits = [];

  const client = await clientPromise;
  const database = client.db("collectionData");
  const traitCol = database.collection("Traits");

  //const item = await foods.findOne(query);

  const cursor = traitCol.find({});

  await cursor.forEach((doc) => {
    //console.log(doc);
    traits.push({ filterName: doc.attribute_name, options: doc.attribute_counts });
  })

  return {
    props: {
      traits
    },
  };
}

export default function Gallery({ traits }) {
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [searchValue, setSearchValue] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [collectionTraits, setCollectionTraits] = useState([]);
  const [sortBy, setSortBy] = useState("tokenId");

  let collectionId = "0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d";
  let skipAmt = 0;
  //setCollectionTraits(traits);
  const stringFilters = JSON.stringify(selectedFilters);
  console.log(stringFilters);

  let url = searchValue === "" 
            ? `/api/collection/${collectionId}?sortBy=${sortBy}&limit=20&skip=${skipAmt}&filters=${stringFilters}`
            : `/api/collection/${collectionId}?searchValue=${searchValue}&sortBy=${sortBy}&limit=20&skip=${skipAmt}&filters=${stringFilters}`;

  const { data } = useSWR(url, fetcher);

  console.log(`/api/collection/${collectionId}?sortBy=${sortBy}&limit=20&skip=${skipAmt}`);

  if (typeof(data) !== "undefined" && loadingState === "not-loaded") {
    let firstItems = data.items;
    let currentCount = data.total;

    console.log(firstItems);
    console.log('here');
    if (firstItems.length < currentCount) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setTotal(currentCount);
    setCollectionNfts(firstItems);
  
    setLoadingState("loaded");
  }
  


  useEffect(() => {
    setLoadingState("not-loaded");
    //setCollectionNfts([]);
    //loadCollectionNFTs();
    // //setTotal(collectionSize);
    setCollectionTraits(traits);
  }, [selectedFilters, searchValue, sortBy]);

  async function loadCollectionNFTs(moreListings = false) {
    //re-call everytime selectedFilters is changed
    const stringFilters = JSON.stringify(selectedFilters);
    const skipAmt = moreListings ? collectionNfts.length : 0;

    const { firstItems, currentCount } = fetch(
      `/api/collection/${collectionId}?searchValue=${searchValue}&sortBy=${sortBy}&limit=20&skip=${skipAmt}&filters=${stringFilters}`
    );

    let currNfts, currCount;
    if (!moreListings) {
      currNfts = [];
      currCount = currentCount;
    } else {
      currNfts = collectionNfts;
      currCount = total;
    }

    if (firstItems.length + currNfts.length < currCount) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setTotal(currCount);
    setCollectionNfts(currNfts.concat(firstItems))

    setLoadingState("loaded");
  }

  const getMoreListings = async () => {

    const stringFilters = JSON.stringify(selectedFilters);
    const skipAmt = collectionNfts.length;

    let url = searchValue === "" 
            ? `/api/collection/${collectionId}?sortBy=${sortBy}&limit=20&skip=${skipAmt}&filters=${stringFilters}`
            : `/api/collection/${collectionId}?searchValue=${searchValue}&sortBy=${sortBy}&limit=20&skip=${skipAmt}&filters=${stringFilters}`;

    const res = await fetch(url);
    const data = await res.json();

    let nextItems = data.items;

    if (nextItems.length + collectionNfts.length < total) {
      setHasMore(true);
    } else {
      setHasMore(false);
    }
    setCollectionNfts(collectionNfts.concat(nextItems));
  };

  const handleSearchFilter = (e) => {
    e.preventDefault();
    //console.log(collectionNfts);
    setSearchValue(e.target.filter.value);
    const filteredArray = collectionNfts.filter((nft) => {
      //console.log(nft);
      nft.metadata.name.split("#")[1].includes(e.target.filter.value);}
    );
    setCollectionNfts(filteredArray);
  };

  const handleDropdownFilter = (e) => {
    console.log(e.target.value);
    const selectedValue = e.target.value;
    setSortBy(selectedValue);
  };

  return (
    <PageTemplate
      page={
        <div className="flex-col justify-center">
          <Head>
            <title>NFT Gallery</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <br />
          <br />
          <div className="flex">
            {/* Left Filter */}
            <div className="mx-4 w-96">
              <div className="flex items-end">
                <h2 className="text-2xl font-bold text-yellow-300">FILTER</h2>
                <h1 className="mx-2 text-2xl font-bold text-yellow-300">//</h1>
              </div>
              <br />
              <FilterSelector
                traitJSON={collectionTraits}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            </div>

            {/* Right Search/Pills/Gallery */}
            <div>
              <div className="flex items-end px-4">
                <h2 className="text-2xl font-bold text-yellow-300">GALLERY // {total}</h2>
                <h1 className="mx-2 text-2xl font-bold text-yellow-300">//</h1>
              </div>
              <br />

              {/* Search + Sort */}
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
                    className="form-select dropdown relative block w-full w-120 px-4 py-2"
                    name="price"
                    id="price"
                    onChange={handleDropdownFilter}
                  >
                    <option value="tokenId">Token ID</option>
                    <option value="rarity">Rarity (most to least)</option>
                  </select>
                </div>
              </div>
              

              {/* Filter Pills */}
              <div className="ml-4">
                <FilterPills
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              </div>

              {/* Gallery */}
              <div className="flex justify-center">
                <div style={{ maxWidth: "1600px" }}>
                  <InfiniteScroll
                    dataLength={collectionNfts.length}
                    next={() => getMoreListings(true)}
                    hasMore={hasMore}
                    loader={<h3> Collection Loading...</h3>}
                    endMessage={<h4></h4>}
                  >
                    <div className="grid grid-cols-1 gap-4 p-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                      {collectionNfts.map((nft, i) => (
                        <Link
                          key={i}
                          href={`collection/${nft.contract}/${nft.id}`}
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
      }
    />
  );
}
