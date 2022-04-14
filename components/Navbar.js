import { useState } from "react";
import BigButton from "./BigButton";

export default function Navbar({ bg }) {
  const [showMobileOptions, setShowMobileOptions] = useState(true);
  return (
    <>
    {/* Mobile */}
    <nav className="lg:hidden flex flex-wrap items-center justify-between w-full px-4">
      <div className='flex flex-wrap items-center justify-between w-full'>
        <div>
          <a className="pr-2 text-xl font-semibold text-white" href="/">
            <img
              className="logo-fyat"
              src="https://pbs.twimg.com/profile_images/1469164041558007808/FRqpXQX5_400x400.jpg"
            ></img>
          </a>
        </div>
        <svg
          xmlns="<http://www.w3.org/2000/svg>"
          id="menu-button"
          className="h-6 w-6 cursor-pointer md:hidden block"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={() => setShowMobileOptions(!showMobileOptions)}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
      <div className={(showMobileOptions ? '' : 'hidden')}>
        <ul>
          <li>
            <a class="md:p-4 py-2 block" href="#">Join Our Discord</a>
          </li>
          <li>
            <a class="md:p-4 py-2 block" href="#">My Collection</a>
          </li>
        </ul>
      </div>
    </nav>

    {/* Desktop */}
    <nav className={"navbar-expand-lg hidden lg:flex relative flex w-full flex-wrap items-center justify-between " + (bg ?? "")}>
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
                <a className="nav-link p-0 text-white" href="my-assets">
                  <BigButton text='My Collection' bg='bg-yellow-400' textColor={'text-black'} />
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