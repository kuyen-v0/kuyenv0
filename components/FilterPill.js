import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function FilterPill({ optionName, onClick=()=>{} }) {
  return (
    <button onClick={onClick} className='flex items-center border-2 border-white text-white rounded mr-4 px-3 py-2 hover:shadow-2xl duration-300'>
      <p className='mr-2'>{optionName}</p>
      <FontAwesomeIcon icon={faXmark} className='hover:text-black duration-300' />
    </button>
  );
}

export function FilterPills({
  currentlySelected=['asdf', 'test'], // This should be a state variable from the parent page
  onPillClick=(optionName)=>{} , // This should be passed in from the parent page to update the state variable appropriately
}) {
  return (
    <div className='flex items-center pt-4'>
      {currentlySelected.map(optionName => (
        <FilterPill optionName={optionName} onClick={() => onPillClick(optionName)} key={optionName} />
      ))}
    </div>
  )
}