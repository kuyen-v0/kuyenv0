import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function FilterPill({ option, onClick=()=>{} }) {
  return (
    <button onClick={() => onClick(option)} className='flex items-center border-2 border-white text-white rounded mr-4 px-3 py-2 hover:shadow-2xl duration-300'>
      <p className='mr-2'>{option.optionName}</p>
      <FontAwesomeIcon icon={faXmark} className='hover:text-black duration-300' />
    </button>
  );
}

export function FilterPills({
  selectedFilters, // This should be a state variable from the parent page
  setSelectedFilters, // This should be passed in from the parent page to update the state variable appropriately
}) {

  const selectedOptions = selectedFilters.map(
    filter => filter.options.map(
      option => ({filterName: filter.filterName, optionName: option})
    )
  ).flat();

  // const updateSelectedFilters = removedOption => {
  //   const newSelectedOptions = [];
  //   selectedOptions.forEach()
  // }

  return (
    <div className='flex items-center pt-4'>
      {selectedOptions.map(option => (
        <FilterPill option={option} onClick={() => onPillClick(option)} key={JSON.stringify(option)} />
      ))}
    </div>
  )
}