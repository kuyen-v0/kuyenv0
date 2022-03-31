import { useEffect, useState } from "react";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";
import { db } from "../firebase/initFirebase";
import { collection, query, where, orderBy, startAfter, limit, getDocs} from "firebase/firestore";

import GalleryItem from "../components/GalleryItem";
import FilterSelector from "../components/FilterSelector";
import PageTemplate from "../components/PageTemplate";
import { FilterPills } from "../components/FilterPill";

// console.log(`${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`);

const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);
// const server_url = process.env.MORALIS_SERVER_URL;
// const app_id = process.env.MORALIS_APP_ID;
// Moralis.start({server_url, app_id});

//const collectionContracts = ["0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d"];

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

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
  let collectionSize = 8080;

  let traits = [];

  const querySnapshot = await getDocs(
    collection(db, collectionId, "TraitData", "Traits")
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    traits.push({ filterName: doc.id, options: doc.data() });
  });

  //console.log(traits);

  // Query the first page of docs

  //console.log("last", last);

  // Construct a new query starting at this document,
  // get the next 25 cities.
  //const res = await fetch('http://localhost:3000/api/traits/0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d');
  //const traits = await res.json();

  return {
    props: {
      collectionSize,
      traits,
    },
  };
}

export default function Gallery({ collectionSize, traits }) {
  const [collectionNfts, setCollectionNfts] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastVisible, setLastVisible] = useState();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [hasMore, setHasMore] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [collectionTraits, setCollectionTraits] = useState([]);

  let collectionId = "0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d";

  useEffect(() => {
    setLoadingState("not-loaded");
    setCollectionNfts([]);
    loadCollectionNFTs();
    setTotal(collectionSize);
    setCollectionTraits(traits);
  }, [selectedFilters]);

  async function loadCollectionNFTs() {
    //refresh everytime selectedFilters is changed
    const unpackSelectedFilters = (selectedFilters) => {
      return selectedFilters
        .map((filter) =>
          filter.options.map((option) => ({
            trait_type: filter.filterName,
            value: option,
          }))
        )
        .flat();
    };
    const selectedOptions = unpackSelectedFilters(selectedFilters);

    let first;
    console.log(collectionId);
    if (selectedOptions.length === 0) {
      first = query(
        collection(db, collectionId, "NFTData", "NFTs"),
        orderBy("id"),
        limit(20)
      );
      console.log(first);
    } else {
      first = query(
        collection(db, collectionId, "NFTData", "NFTs"),
        where("metadata.attributes", "array-contains-any", selectedOptions),
        orderBy("id"),
        limit(20)
      );

      /*
      await client.connect();
      const database = client.db("sample_mflix");
      const movies = database.collection("movies");


      for each option in selected filters
      get list of selected options for the filtername
      get id for the filtername
      query["metadata.attributes." + id + ".value"] = {$in: listOfOptions};
      const sort = {id: 1};
      const currentCount = await movies.countDocuments(query);
      const cursor = collection.find(query).sort(sort).limit(limit);
      */

    }
    const firstResult = await getDocs(first);
    let firstItems = [];
    firstResult.forEach((doc) => {
      firstItems.push(doc.data());
    });
    if (firstItems.length < 20) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
    //console.log()
    console.log(firstItems);
    setCollectionNfts(firstItems);
    console.log(collectionNfts);
    //const firstItems = firstResult.map(result => result.data);

    // Get the last visible document
    const last =
      firstResult.docs.length !== 0
        ? firstResult.docs[firstResult.docs.length - 1]
        : null;
    console.log(last);
    setLastVisible(last);

    setLoadingState("loaded");
    console.log(collectionNfts);
  }

  const getMoreListings = async () => {
    if (collectionNfts.length === total) {
      setHasMore(false);
    }
    const unpackSelectedFilters = (selectedFilters) => {
      return selectedFilters
        .map((filter) =>
          filter.options.map((option) => ({
            trait_type: filter.filterName,
            value: option,
          }))
        )
        .flat();
    };
    const selectedOptions = unpackSelectedFilters(selectedFilters);

    let next;

    if (selectedOptions.length === 0) {
      next = query(
        collection(db, collectionId, "NFTData", "NFTs"),
        orderBy("id"),
        startAfter(lastVisible),
        limit(20)
      );
    } else {
      next = query(
        collection(db, collectionId, "NFTData", "NFTs"),
        where("metadata.attributes", "array-contains-any", selectedOptions),
        orderBy("id"),
        startAfter(lastVisible),
        limit(20)
      );
    }

    const nextResult = await getDocs(next);
    let nextItems = [];
    nextResult.forEach((doc) => {
      nextItems.push(doc.data());
    });

    if (nextItems.length < 20) {
      setHasMore(false);
    }

    // Get the last visible document
    const last = nextResult.docs[nextResult.docs.length - 1];
    setLastVisible(last);
    setCollectionNfts(collectionNfts.concat(nextItems));
    //setSubset(collectionNfts.slice(0, subset.length + 4));
  };

  const handleSearchFilter = (e) => {
    e.preventDefault();
    const filteredArray = collectionNfts.filter((nft) =>
      nft.name.split("#")[1].includes(e.target.filter.value)
    );
    setCollectionNfts(filteredArray);
  };

  const handleDropdownFilter = (e) => {
    const selectedValue = e.value;

    if (selectedValue === "rarity") {
      setCollectionNfts(collectionNfts.reverse());
    }
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
                <h2 className="text-2xl font-bold text-yellow-300">GALLERY</h2>
                <h1 className="mx-2 text-2xl font-bold text-yellow-300">//</h1>
              </div>
              <br />

              {/* Search */}
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
                    next={getMoreListings}
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
