import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import Head from "next/head";
import clientPromise from "../lib/mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import GalleryItem from "../components/GalleryItem";
import FilterSelector from "../components/FilterSelector";
import PageTemplate from "../components/PageTemplate";
import { FilterPills } from "../components/FilterPill";

import {Transition, Dialog, Menu} from "@headlessui/react";
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
    const searchInput = document.getElementById('gallerySearchInput').value;
    setSearchValue(searchInput);
  };

  const handleDropdownSort = (e) => {
    e.preventDefault();
    const sortValue = e.target.value;
    setSortBy(sortValue);
  };

  let plural = (total > 1) ? "RESULTS" : "RESULT";

  // TODO: Move to its own component
  const FilterSidebar = (
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
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-yellow-300">FILTER //</h2>
              <button type="button" className="-mr-2 w-10 rounded-md flex items-center justify-center hover:cursor" tabIndex="0" onClick={() => setShowFilters(false)}>
                <span className="sr-only">Close menu</span>
                <FontAwesomeIcon icon={faXmark} className='text-yellow-300 h-6' />
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
  );

  return (
    <PageTemplate
      page={
        <div className="flex-col justify-center max-w-full h-full">
          <Head>
            <title>NFT Gallery</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <div className="flex max-w-full h-full">
            {/* Left Filter */}
            <div className="mx-4 w-96 hidden lg:flex flex-col">
              <div className="flex items-end mb-4">
                <h2 className="text-2xl font-bold text-yellow-300">FILTER</h2>
                <h1 className="mx-2 text-2xl font-bold text-yellow-300">//</h1>
              </div>
              <div className='h-full no-scrollbar overflow-y-auto'>
                <FilterSelector
                  traitJSON={collectionTraits}
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                />
              </div>
            </div>

            {FilterSidebar}

            {/* Right Search/Pills/Gallery */}
            <div className="h-full flex flex-col">
              <div className="flex items-end px-4 mb-2">
                <h2 className="text-2xl font-bold text-yellow-300">GALLERY //</h2>
                <p className="hidden sm:block text-2xl font-bold text-yellow-300">&nbsp;{total} {plural}</p>
              </div>

              {/* Search */}
              <div className="ml-4 mr-4 flex items-center justify-start">
                <form onSubmit={handleSearchFilter}>
                  <div className="flex">
                  
                    <div className="relative flex border border-white rounded-sm">
                      <input className="bg-transparent min-w-0 w-full pr-0 text-white placeholder-white focus:placeholder-gray-400 focus:border-transparent border-transparent focus:ring-0" type="search" id="gallerySearchInput" placeholder="Search..." />
                      <button
                        type="submit"
                        className="flex items-center justify-center px-2"
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

                  </div>
                </form>

                {/* Sort */}
                <div className="flex ml-3 h-full">

                  <div className="text-right z-50 h-full">
                    <Menu as="div" className="relative inline-block text-left h-full">
                      <div className='h-full'>
                        <Menu.Button className="border rounded-sm border-white bg-transparent inline-flex w-full h-full justify-center items-center px-4 py-2 text-white focus:outline-none">
                          Sort By: {/* Todo: selection name here */}
                          <FontAwesomeIcon icon={faChevronDown} className='ml-2 text-yellow-300 h-5' />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="focus:outline-none absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-100">
                          <div className="px-1 py-1 ">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                >
                                  {active ? (
                                    // <DuplicateActiveIcon
                                    //   className="mr-2 h-5 w-5"
                                    //   aria-hidden="true"
                                    // />
                                    <p>asdf</p>
                                  ) : (
                                    // <DuplicateInactiveIcon
                                    //   className="mr-2 h-5 w-5"
                                    //   aria-hidden="true"
                                    // />
                                    <p>dfda</p>
                                  )}
                                  Duplicate
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>

                  {/* <FormControl>
                    <InputLabel id="sortLabel">Sort By</InputLabel>
                    <Select
                      labelId="sortLabel"
                      label="Sort"
                      id="gallerySortInput"
                      style={{ minWidth: 120, height: '3rem' }}
                      value={sortBy}
                      onChange={handleDropdownSort}
                    >
                      <MenuItem value={"tokenId"}>Token ID</MenuItem>
                      <MenuItem value={"rarity"}>Rarity (most to least)</MenuItem>
                    </Select>
                  </FormControl> */}
                </div>

                <div className='lg:hidden ml-3'>
                  <button 
                    className='text-yellow-300 hover:cursor'
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    Filter
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
              <div className="flex justify-center h-full overflow-y-hidden no-scrollbar">
                <div style={{ maxWidth: "1600px" }}>
                  <InfiniteScroll
                    dataLength={collectionNfts.length}
                    next={getMoreListings}
                    hasMore={hasMore}
                    loader={<h3> Collection Loading...</h3>}
                    height={'100vh'}
                    endMessage={<h4></h4>}
                  >
                    <div className="grid gap-4 p-4 pt-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
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
