
export default function FilterCheckboxes({filter}) {
  const optionKeys = Object.keys(filter.options);

  let [checked, setChecked] = useState([]);

  const updateChecked = (e) => {
    if (e.target.value in checked) {
      setChecked(checked.splice(checked.indexOf(e.target.value), 1));
    } else {
      setChecked(checked.concat(e.target.value));
    }
  }

  const options = optionKeys.map(option => (
    <div className='form-check' key={option} value={option} onClick={updateChecked}>
      <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" onClick="handleCheckbox" />
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