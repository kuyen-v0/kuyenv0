import { useState } from "react";
import FilterCheckboxes from "./FilterCheckboxes";
import FilterOption from "./FilterOptions.js";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect } from "react";

import { FILTERS } from "../pages/nft-data";


export default function FilterSelector({onChangeFilter}) {
  //fetch filters from API
  //const filters = JSON.parse(FILTERS);
  //console.log(traits);
  //console.log(onChangeFilter);


  //console.log(filters);

  //useEffect(() => {}, []);

  const traits = JSON.parse(FILTERS);

  // if (!filters) return (
  //   <div display='flex-col text-white'>
  //     <hr className='border-stone-300' />
  //     Loading...
  //   </div>
  // );
  //console.log(`/api/traits/${process.env.TOKEN_CONTRACT}`);
  //console.log(filters);
  let [optionsSelected, setOptionsSelected] = useState([]); //[{Palette: ["Cold Blue"]}, {Pose: [""]}]
  const filterOptions = traits.map(filter => <FilterOption filter={filter} key={filter.filterName} setOptionCallback={(options) => {
    console.log(options);

    let filterIndex = optionsSelected.findIndex((obj => obj.filterName == filter.filterName));
    let o = optionsSelected.slice();
    console.log(o);
    if (filterIndex === -1) {
      o.push({filterName: filter.filterName, options: options});
    } else {
      o[filterIndex] = {filterName: filter.filterName, options: options};
    }
    //find Index of filterName
    //let o = {...optionsSelected};
    //ilterName] = options
    console.log(o);
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