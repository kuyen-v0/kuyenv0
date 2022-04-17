import { useState } from "react";
import Navbar from "./Navbar";

export default function PageTemplate({ page, navProps }) {

  const [scrollPos, setScrollPos] = useState(0);

  const handleScroll = (e) => {
    setScrollPos(e.target.scrollTop);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className={scrollPos > 0 ? 'shadow-md' : ''}>
        <Navbar {...navProps} />
      </header>
      <main className='flex-1 overflow-y-auto' id='asdf' onScroll={handleScroll}>
        {page}
      </main>
    </div>
  );
}