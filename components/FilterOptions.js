import { useState } from "react";
import FilterCheckboxes from "./FilterCheckboxes";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect } from "react";

export default function FilterOption({filter, setOptionCallback}) {
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

