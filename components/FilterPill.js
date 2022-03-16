import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function FilterPill({ optionName }) {
  return (
    <button className='flex items-center border-2 border-white text-white rounded mr-4 px-3 py-2 hover:shadow-2xl duration-300'>
      <p className='mr-2'>{optionName}</p>
      <FontAwesomeIcon icon={faXmark} />
    </button>
  );
}

export function FilterPills({ currentlySelected=['asdf', 'test'] }) {
  return (
    <div className='flex items-center pt-4'>
      {currentlySelected.map(optionName => (
        <FilterPill optionName={optionName} />
      ))}
    </div>
  )
}