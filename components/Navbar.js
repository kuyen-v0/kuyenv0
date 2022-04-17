import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import BigButton from "./BigButton";

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ bg }) {
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const customStyle = { background: bg?.slice(4, -1) };

  return (
    <>
    {/* Mobile */}
    <nav className={"lg:hidden flex flex-wrap items-center justify-between w-full px-4"} style={customStyle}>
      <div className='flex flex-wrap items-center justify-between w-full'>
        <div>
          <a className="pr-2 text-xl font-semibold text-white" href="/">
            <img
              className="logo-fyat"
              src="https://pbs.twimg.com/profile_images/1469164041558007808/FRqpXQX5_400x400.jpg"
            ></img>
          </a>
        </div>
        <FontAwesomeIcon className='h-8' icon={faBars} onClick={() => setShowMobileOptions(true)} />
      </div>
      <aside class={(showMobileOptions ? 'translate-x-0' : 'translate-x-full') + " transform top-0 right-0 w-full bg-black/75 text-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 lg:hidden"}>
        <div className='flex-col'>
            <div className='flex justify-end mx-5 mb-10 mt-10'>
              <button onClick={() => setShowMobileOptions(false)}>
                <FontAwesomeIcon icon={faXmark} className='h-8 text-white' />
              </button>
            </div>
            <ul className='mr-5'>
              <li className='mb-5'>
                <a className="py-2 block text-right" href="https://discord.gg/fyatlux">Join Our Discord</a>
              </li>
              <li>
                <a className="py-2 block text-right" href="my-assets">My Collection</a>
              </li>
            </ul>
        </div>
      </aside>
    </nav>

    {/* Desktop */}
    <nav className="navbar-expand-lg hidden lg:flex relative flex w-full flex-wrap items-center justify-between" style={customStyle}>
      <div className="container-fluid flex w-full flex-wrap items-center justify-between px-6">
        <div
          className="collapse navbar-collapse flex-grow place-content-between items-center"
          id="navbarSupportedContent1"
        >
          <div>
            <a className="pr-2 text-xl font-semibold text-white" href="/">
              <img
                className="logo-fyat"
                src="https://pbs.twimg.com/profile_images/1469164041558007808/FRqpXQX5_400x400.jpg"
              ></img>
            </a>
          </div>
          <div>
            <ul className="navbar-nav list-style-none mr-auto flex flex-col pl-0">
              <li className="nav-item p-2">
                <a
                  className="nav-link text-white"
                  href="https://discord.gg/fyatlux"
                >
                  <BigButton text='Join Our Discord' />
                </a>
              </li>
              <li className="nav-item p-2">
                <a
                  className="nav-link p-0 text-white"
                  href="https://collection.fyatlux.com/"
                >
                  <BigButton
                    text="My Collection"
                    bg="bg-yellow-400"
                    textColor={"text-black"}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </nav>
    </>
  );
}
