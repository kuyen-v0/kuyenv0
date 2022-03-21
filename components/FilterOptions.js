import { useState } from "react";

/**
 * One filter option of the sidebar. Controls the show/hide and checkboxes.
 */
export default function FilterOption({trait, filter, setOptionCallback}) {
  let [hidden, setHidden] = useState(true);
  const toggleHidden = () => {
    setHidden(!hidden);
  }

  /**
   * Toggle the checkbox.
   * If the option name appears in the filter already, remove it. Else, add it.
   */
  const optionOnChange = (optionName) => {
    let selectedOptionNames = filter.options.slice();
    if (selectedOptionNames.includes(optionName)) {
      selectedOptionNames = selectedOptionNames.filter(selectedOptionName => selectedOptionName !== optionName);
    } else {
      selectedOptionNames.push(optionName);
    }
    setOptionCallback(selectedOptionNames);
  }

  const options = Object.keys(trait.options).map(option => (
    <div key={option}>
      <input 
        className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
        type="checkbox" 
        checked={filter.options.includes(option)} // Show checked if this option appears in filter.
        onChange={() => optionOnChange(option)}
        id={option}
      />
      <label className="form-check-label inline-block text-white" htmlFor={option}>
        {option} ({trait.options[option]})
      </label>
    </div>
  ))

  return (
    <div>
      <div>
        <h2 className="flex align-bottom">
          <button className="relative flex justify-between items-center py-3 w-full text-white" onClick={toggleHidden}>
            <div>{trait.filterName}</div>
            <div className='mx-2'><b>{hidden ? '+' : '-'}</b></div>
          </button>
        </h2>
      </div>
      <div className={"ml-4 mb-2 border-0 collapse show" + (hidden ? ' hidden' : '')}>
        {options}
      </div>
      <hr className='border-stone-300' />
    </div>
  );
}

