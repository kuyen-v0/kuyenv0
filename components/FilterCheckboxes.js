import { useState } from "react";


export default function FilterCheckboxes({trait, setOptionCallback}) {
  const optionKeys = Object.keys(trait.options);

  // console.log(filter);
  
  const updateChecked = (e, event) => {
    if (event.target.tagName == "LABEL") {
      return;
    }
    
  }

  const options = optionKeys.map(option => (
    <div className='form-check' key={option} onClick={(event) => updateChecked(option, event)}>
      <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" id="flexCheckDefault" />
      <label className="form-check-label inline-block text-white" htmlFor="flexCheckDefault">
        {option} ({trait.options[option]})
      </label>
    </div>
  ))
  return (
    <div>
      {options}
    </div>
  );
}