import { useState } from "react";
import FilterOption from "./FilterOptions.js";

import { FILTERS } from "../pages/nft-data";


export default function FilterSelector({ selectedFilters, setSelectedFilters }) {
  const traits = JSON.parse(FILTERS);

  const updateSelectedFilters = (filterName, newFilterValue) => {
    const updatedFilter = {filterName, options: newFilterValue};

    const newSelectedFilters = [];
    // Update filter if already in selectedFilters
    selectedFilters.forEach(filter => {
      if (filter.filterName === filterName) {
        newSelectedFilters.push(updatedFilter);
      } else {
        newSelectedFilters.push(filter);
      }
    });
    // Add filter if not already in selectedFilters
    if (!newSelectedFilters.map(filter => filter.filterName).includes(filterName)) {
      newSelectedFilters.push(updatedFilter);
    }

    setSelectedFilters(newSelectedFilters);
  }

  const filterOptions = traits.map(filter => 
    <FilterOption 
      filter={filter} 
      key={filter.filterName} 
      setOptionCallback={(newOptions) => updateSelectedFilters(filter.filterName, newOptions)}
    />
  );

  return (
    <div display='flex-col text-white'>
      <hr className='border-stone-300' />
      {filterOptions}
    </div>
  );
}