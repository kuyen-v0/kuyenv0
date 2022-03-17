import { useState } from "react";


export default function FilterCheckboxes({filter, setOptionCallback}) {
  const optionKeys = Object.keys(filter.options);
  //console.log(filter);

  let [checked, setChecked] = useState([]);

  const updateChecked = (e, event) => {
    if (event.target.tagName == "LABEL") {
      return;
    }
    console.log(e);
    console.log(event);
    console.log(checked);
    if (checked.includes(e)) {
      console.log('reached here');
      let result = checked.filter(option => option != e)
      setChecked(result);
      setOptionCallback(result);
    } else {
      let checkedCopy = checked.slice();
      checkedCopy.push(e);
      setChecked(checkedCopy);
      setOptionCallback(checkedCopy);
    }
    //setOptionCallback(checked);
  }

  const options = optionKeys.map(option => (
    <div className='form-check' key={option} onClick={(event) => updateChecked(option, event)}>
      <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" id="flexCheckDefault" />
      <label className="form-check-label inline-block text-white" htmlFor="flexCheckDefault">
        {option} ({filter.options[option]})
      </label>
    </div>
  ))
  return (
    <div>
      {options}
    </div>
  );
}