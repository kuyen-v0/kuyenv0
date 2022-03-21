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

/*
  Convert selectedFilters to format: [ {filterName: str, optionName: str}, ... ]
  Inverse of packSelectedOptions
*/
const unpackSelectedFilters = selectedFilters => {
  return selectedFilters.map(
    filter => filter.options.map(
      option => ({filterName: filter.filterName, optionName: option})
    )
  ).flat();
}

/*
  Convert selectedOptions to format: [ {filterName: str, options:[ list of all optionNames under filterName ] } ]
  Inverse of unpackSelectedFilters
*/
const packSelectedOptions = selectedOptions => {
  const filterNamesToOptionNames = {};
  selectedOptions.forEach(option => {
    if (!Object.keys(filterNamesToOptionNames).includes(option.filterName)) {
      filterNamesToOptionNames[option.filterName] = [];
    }
    filterNamesToOptionNames[option.filterName].push(option.optionName);
  });

  const selectedFilters = [];
  Object.keys(filterNamesToOptionNames).forEach(filterName => {
    selectedFilters.push({
      filterName,
      options: filterNamesToOptionNames[filterName],
    });
  });
  return selectedFilters;
}

export function FilterPills({
  selectedFilters, // This should be a state variable from the parent page
  setSelectedFilters, // This should be passed in from the parent page to update the state variable appropriately
}) {
  const selectedOptions = unpackSelectedFilters(selectedFilters);

  const updateSelectedFilters = removedOption => {
    const newSelectedOptions = [];
    selectedOptions.forEach(option => {
      if (!(option.filterName == removedOption.filterName && option.optionName == removedOption.optionName)) {
        newSelectedOptions.push(option);
      }
    });
    const newSelectedFilters = packSelectedOptions(newSelectedOptions);
    setSelectedFilters(newSelectedFilters);
  }

  return (
    <div className='flex items-center pt-4'>
      {selectedOptions.map(option => (
        <FilterPill option={option} onClick={updateSelectedFilters} key={JSON.stringify(option)} />
      ))}
    </div>
  )
}