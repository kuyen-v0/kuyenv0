
export default function FilterCheckboxes({filter}) {
  const options = filter.filterType.options.map(option => (
    <div className='form-check' key={option}>
      <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-black checked:border-black focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault" />
      <label className="form-check-label inline-block text-white" htmlFor="flexCheckDefault">
        {option}
      </label>
    </div>
  ))
  return (
    <div>
      {options}
    </div>
  );
}