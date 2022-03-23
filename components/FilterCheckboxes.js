import { useState } from "react";

export default function FilterCheckboxes({ filter, setOptionCallback }) {
  const optionKeys = Object.keys(filter.options);
  const [checked, setChecked] = useState([]);

  const updateChecked = (e, event) => {
    if (event.target.tagName === "LABEL") {
      return;
    }
    if (checked.includes(e)) {
      const result = checked.filter((option) => option !== e);
      setChecked(result);
      setOptionCallback(result);
    } else {
      const checkedCopy = checked.slice();
      checkedCopy.push(e);
      setChecked(checkedCopy);
      setOptionCallback(checkedCopy);
    }
  };

  const options = optionKeys.map((option) => (
    <div
      className="form-check"
      key={option}
      onClick={(event) => updateChecked(option, event)}
    >
      <input
        className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-black checked:bg-black focus:outline-none"
        type="checkbox"
        id={option}
      />
      <label
        className="form-check-label inline-block text-white"
        htmlFor={option}
      >
        {option} ({filter.options[option]})
      </label>
    </div>
  ));
  return <div>{options}</div>;
}
