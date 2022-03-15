import { useState } from "react";
import FilterCheckboxes from "./FilterCheckboxes";
import { useRouter } from "next/router";
import useSWR from "swr";

//import { FILTERS } from "../pages/nft-data";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.error);
  }
  return data;
};

export async function getStaticProps() {
  const { query } = useRouter();
  const { data } = useSWR(
    `/api/traits/${process.env.TOKEN_CONTRACT}`,
    fetcher
  );
  

  return {
    props: {
      data
    },
  };
}

export function FilterOption({filter, setOptionCallback}) {
  let [hidden, setHidden] = useState(true);
  const toggleHidden = () => {
    setHidden(!hidden);
  }

  return (
    <div>
      <div>
        <h2 className="flex align-bottom">
          <button className="relative flex justify-between items-center py-3 w-full text-white" onClick={toggleHidden}>
            <div>{filter.filterName}</div>
            <div className='mx-2'><b>{hidden ? '+' : '-'}</b></div>
          </button>
        </h2>
      </div>
      <div className={"ml-4 mb-2 border-0 collapse show" + (hidden ? ' hidden' : '')}>
        <FilterCheckboxes filter={filter} setOptionCallback={setOptionCallback}/>
      </div>
      <hr className='border-stone-300' />
    </div>
  );
}

export default function FilterSelector({ filters, onChangeFilter }) {
  //fetch filters from API
  //const filters = JSON.parse(FILTERS);
  let [optionsSelected, setOptionsSelected] = useState({}); //{Palette: ["Cold Blue"], Pose: [""]}
  const filterOptions = filters.map(filter => <FilterOption filter={filter} key={filter.filterName} setOptionCallback={(options) => {
    let o = {...optionsSelected};
    o[filter.filterName] = options
    setOptionsSelected(o);
    onChangeFilter(o);
  }}/>);
  return (
    <div display='flex-col text-white'>
      <hr className='border-stone-300' />
      {filterOptions}
    </div>
  );
}