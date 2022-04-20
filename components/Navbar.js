import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, Fragment } from "react";
import BigButton from "./BigButton";

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {Transition, Dialog} from "@headlessui/react";

export default function Navbar({ bg }) {
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const customStyle = { background: bg?.slice(4, -1) };

  // TODO: Move to its own component
  const MenuSidebar = (
    <Transition show={showMobileOptions}>
      <Dialog as="div" onClose={() => setShowMobileOptions(false)} className="lg:hidden fixed inset-0 z-40">
        <Transition.Child 
          as={Fragment}
          enter="transition ease-in-out duration-200 transform" 
          enterFrom="translate-x-full" 
          enterTo="translate-x-0" 
          leave="transition ease-in-out duration-200 transform" 
          leaveFrom="translate-x-0" 
          leaveTo="translate-x-full"
        >
          <div className="flex justify-end h-full">
            <div className="flex flex-col px-4 bg-black relative z-10 h-full w-72 lg:hidden pt-10">
              <div className="flex justify-end items-center">
                <button type="button" className="-mr-2 w-10 rounded-md flex items-center justify-center hover:cursor" tabIndex="0" onClick={() => setShowMobileOptions(false)}>
                  <span className="sr-only">Close menu</span>
                  <FontAwesomeIcon icon={faXmark} className='text-yellow-300 h-6' />
                </button>
              </div>
              <br />
              <div className="overflow-y-auto flex-1 text-white">
                <ul className='mr-5'>
                  <li className='mb-5'>
                    <a className="py-2 block text-right" href="https://discord.gg/fyatlux">Join Our Discord</a>
                  </li>
                  <li>
                    <a className="py-2 block text-right" href="https://collection.fyatlux.com/">My Collection</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Transition.Child>
        
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-white bg-opacity-50">
          </Dialog.Overlay>
        </Transition.Child>
      </Dialog>
    </Transition>
  );

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
      {MenuSidebar}
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
