import { useState } from "react";
import Navbar from "./Navbar";

export default function PageTemplate({ page, navProps, mainProps={} }) {

  const [scrollPos, setScrollPos] = useState(0);

  const handleScroll = (e) => {
    setScrollPos(e.target.scrollTop);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className={(scrollPos > 0 ? 'shadow-md' : '') + ' h-36'}>
        <Navbar {...navProps} />
      </header>
      <div className='flex-1 overflow-y-auto h-full' id='asdf' style={mainProps.customStyle} onScroll={handleScroll}>
        {page}
      </div>
    </div>
  );
}