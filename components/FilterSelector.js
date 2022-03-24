import FilterOption from "./FilterOptions.js";
export default function FilterSelector({ 
  traitJSON, 
  selectedFilters, 
  setSelectedFilters 
}) {
  const traits = traitJSON;

  if (traits === undefined) {
    return (
      <div display='flex-col text-white'>
        <hr className='border-stone-300' />
        Loading...
      </div>
    );
  }


  const updateSelectedFilters = (filterName, newFilterValue) => {
    const updatedFilter = { filterName, options: newFilterValue };

    const newSelectedFilters = [];
    // Update filter if already in selectedFilters
    selectedFilters.forEach((filter) => {
      if (filter.filterName === filterName) {
        newSelectedFilters.push(updatedFilter);
      } else {
        newSelectedFilters.push(filter);
      }
    });
    // Add filter if not already in selectedFilters
    if (
      !newSelectedFilters
        .map((filter) => filter.filterName)
        .includes(filterName)
    ) {
      newSelectedFilters.push(updatedFilter);
    }

    setSelectedFilters(newSelectedFilters);
  };

  const filterNameToFilter = {};
  selectedFilters.forEach((filter) => {
    filterNameToFilter[filter.filterName] = filter;
  });

  const filterOptions = traits.map((trait) => (
    <FilterOption
      trait={trait}
      // If filter exists, use that. Else, put in default empty filter
      filter={
        filterNameToFilter[trait.filterName] ?? {
          filterName: trait.filterName,
          options: [],
        }
      }
      key={trait.filterName}
      setOptionCallback={(newOptions) =>
        updateSelectedFilters(trait.filterName, newOptions)
      }
    />
  ));

  return (
    <div display="flex-col text-white">
      <hr className="border-stone-300" />
      {filterOptions}
    </div>
  );
}
