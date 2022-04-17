import { useEffect, useState } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";
import clientPromise from "../lib/mongodb";

import GalleryItem from "../components/GalleryItem";
import FilterSelector from "../components/FilterSelector";
import PageTemplate from "../components/PageTemplate";
import { FilterPills } from "../components/FilterPill";
import useSWR from "swr";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

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

  let traits = [];

  const client = await clientPromise;
  const database = client.db("collectionData");
  const traitCol = database.collection("Traits");

  const cursor = traitCol.find({});

  await cursor.forEach((doc) => {
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
  const stringFilters = JSON.stringify(selectedFilters);

  let url = searchValue === "" 
            ? `/api/collection/${collectionId}?sortBy=${sortBy}&limit=20&skip=${skipAmt}&filters=${stringFilters}`
            : `/api/collection/${collectionId}?searchValue=${searchValue}&sortBy=${sortBy}&limit=20&skip=${skipAmt}&filters=${stringFilters}`;

  const { data } = useSWR(url, fetcher);

  if (typeof(data) !== "undefined" && loadingState === "not-loaded") {
    let firstItems = data.items;
    let currentCount = data.total;

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
    setCollectionTraits(traits);
  }, [selectedFilters, searchValue, sortBy]);


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
    const searchInput = document.getElementById('gallerySearchInput').value;
    setSearchValue(searchInput);
  };

  const handleDropdownSort = (e) => {
    e.preventDefault();
    const sortValue = e.target.value;
    setSortBy(sortValue);
  };

  let plural = (total > 1) ? "RESULTS" : "RESULT";

  return (
    <PageTemplate
      page={
        <div className="flex-col justify-center max-w-full">
          <Head>
            <title>NFT Gallery</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <div className="flex max-w-full">
            {/* Left Filter */}
            <div className="mx-4 w-96 hidden lg:block">
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
                <h2 className="text-2xl font-bold text-yellow-300">GALLERY //</h2>
                <p className="hidden sm:block text-2xl font-bold text-yellow-300">&nbsp;{total} {plural}</p>
              </div>
              <br />

              {/* Search + Sort */}
              <div className="ml-4 mr-4 flex items-center justify-start">
                <form onSubmit={handleSearchFilter}>
                  <div className="flex">
                    <TextField id="gallerySearchInput" label="Search..." variant="standard" inputProps={{
                      style: {
                        background: 'none',
                        // height: '2rem',
                      }
                    }} />
                    <button
                      type="submit"
                      className="flex items-center justify-center px-4"
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

                <div className="flex ml-6">
                  <FormControl>
                    <InputLabel id="sortLabel">Sort By</InputLabel>
                    <Select
                      labelId="sortLabel"
                      label="Sort"
                      id="gallerySortInput"
                      style={{ minWidth: 100, height: '3rem' }}
                      value={sortBy}
                      onChange={handleDropdownSort}
                    >
                      <MenuItem value={"tokenId"}>Token ID</MenuItem>
                      <MenuItem value={"rarity"}>Rarity (most to least)</MenuItem>
                    </Select>
                  </FormControl>
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
                    next={getMoreListings}
                    hasMore={hasMore}
                    loader={<h3> Collection Loading...</h3>}
                    endMessage={<h4></h4>}
                  >
                    <div className="grid gap-4 p-4 pt-4 grid-cols-2 lg:grid-cols-4">
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
