import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";
import clientPromise from "../lib/mongodb";

import GalleryItem from "../components/GalleryItem";
import FilterSelector from "../components/FilterSelector";
import PageTemplate from "../components/PageTemplate";
import { FilterPills } from "../components/FilterPill";

import {Transition, Dialog} from "@headlessui/react";
import useSWR from "swr";


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
  const [showFilters, setShowFilters] = useState(false);

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
    setSearchValue(e.target.filter.value);
  };

  const handleDropdownFilter = (e) => {
    const selectedValue = e.target.value;
    setSortBy(selectedValue);
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

            <Transition show={showFilters}>
              <Dialog as="div" onClose={() => setShowFilters(false)} className="lg:hidden fixed inset-0 z-40">
                <Transition.Child 
                  as={Fragment}
                  enter="transition ease-in-out duration-200 transform" 
                  enterFrom="-translate-x-full" 
                  enterTo="translate-x-0" 
                  leave="transition ease-in-out duration-200 transform" 
                  leaveFrom="translate-x-0" 
                  leaveTo="-translate-x-full"
                >
                  <div className="flex flex-col px-4 bg-black relative z-10 h-full w-72 lg:hidden pt-10">
                    <div className="flex justify-between items-end">
                      <h2 className="text-xl font-bold text-yellow-300">FILTER //</h2>
                      <button type="button" class="-mr-2 w-10 rounded-md flex items-center justify-center opacity-50 hover:cursor" tabindex="0" onClick={() => setShowFilters(false)}>
                        <span class="sr-only">Close menu</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="yellow" aria-hidden="true" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                    <br />
                    <div className="overflow-y-auto flex-1">
                      <FilterSelector
                        traitJSON={collectionTraits}
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                      />
                    </div>
                    
                  </div>
                </Transition.Child>
                
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-white bg-opacity-50">
                  </Dialog.Overlay>
                </Transition.Child>
              </Dialog>
            </Transition>
            

            

            {/* Right Search/Pills/Gallery */}
            <div>
              <div className="flex items-end px-4">
                <h2 className="text-2xl font-bold text-yellow-300">GALLERY // {total} {plural}</h2>
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
                      className="min-w-0 max-w-80 px-4 py-2"
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

                <div className="hidden lg:flex ml-6 rounded border-2">
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

                <div className="hidden lg:flex ml-6 rounded border-2">
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

                <div className='lg:hidden ml-3'>
                  <button 
                    className='text-yellow-300 hover:cursor'
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    Filters
                  </button>
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
