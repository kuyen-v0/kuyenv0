import { useState } from "react";
import FilterCheckboxes from "./FilterCheckboxes";
import FilterOption from "./FilterOptions.js";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect } from "react";

import { FILTERS } from "../pages/nft-data";


export default function FilterSelector({onChangeFilter}) {
  const traits = JSON.parse(FILTERS);

  let [optionsSelected, setOptionsSelected] = useState([]); //[{Palette: ["Cold Blue"]}, {Pose: [""]}]
  const filterOptions = traits.map(filter => <FilterOption filter={filter} key={filter.filterName} setOptionCallback={(options) => {

    let filterIndex = optionsSelected.findIndex((obj => obj.filterName == filter.filterName));
    let o = optionsSelected.slice();
    if (filterIndex === -1) {
      o.push({filterName: filter.filterName, options: options});
    } else {
      o[filterIndex] = {filterName: filter.filterName, options: options};
    }
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