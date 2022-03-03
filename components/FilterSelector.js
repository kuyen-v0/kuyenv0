import { useState } from "react";

export function FilterOption() {
  let [hidden, setHidden] = useState(true);
  const toggleHidden = () => {
    setHidden(!hidden);
  }

  return (
    <div>
      <div>
        <h2 className="flex align-bottom">
          <button className="relative flex justify-between items-center py-3 w-full text-white" onClick={toggleHidden}>
            <div>Accordion Item #1</div>
            <div className='mx-2'>{hidden ? '+' : '-'}</div>
          </button>
        </h2>
      </div>
      <div className={"border-0 collapse show" + (hidden ? ' hidden' : '')}>
        <div className="text-white pb-4 px-4">Placeholder content for this accordion.</div>
      </div>
      <hr className='border-stone-300' />
    </div>
  );
}

export default function FilterSelector() {
  return (
    <div display='flex-col text-white'>
      <hr className='border-stone-300' />
      <FilterOption />
      <FilterOption />
    </div>
  );
}