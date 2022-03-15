export default function FilterPill({ optionName }) {
  return (
    <button className='mr-4'>{optionName}</button>
  );
}

export function FilterPills({ currentlySelected=['asdf', 'test'] }) {

  return (
    <div className='flex'>
      {currentlySelected.map(optionName => (
        <FilterPill optionName={optionName} />
      ))}
    </div>
  )
}