import { useState } from "react";
import FilterCheckboxes from "./FilterCheckboxes";

import { FILTERS } from "../pages/nft-data";

export function FilterOption({filter}) {
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
        <FilterCheckboxes filter={filter} />
      </div>
      <hr className='border-stone-300' />
    </div>
  );
}

export default function FilterSelector() {
  const filters = JSON.parse(FILTERS);
  const filterOptions = filters.map(filter => <FilterOption filter={filter} key={filter.filterName} />);
  return (
    <div display='flex-col text-white'>
      <hr className='border-stone-300' />
      {filterOptions}
    </div>
  );
}