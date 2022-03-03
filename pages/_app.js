import "../styles/globals.css";
import Script from "next/script";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import Image from "next/image";

function MyApp({ Component, pageProps }) {
  return (
    <div className="main-body-img">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/flowbite@1.3.3/dist/flowbite.min.css"
        />
        <link href="../styles/output.css" rel="stylesheet"></link>
      </Head>

      <div>
        <Script src="https://unpkg.com/flowbite@1.3.3/dist/flowbite.js"></Script>

        <nav className="navbar-expand-lg relative flex w-full flex-wrap items-center justify-between">
          <div className="container-fluid flex w-full flex-wrap items-center justify-between px-6">
            <div
              className="collapse navbar-collapse flex-grow place-content-between items-center"
              id="navbarSupportedContent1"
            >
              <div>
                <a className="pr-2 text-xl font-semibold text-white" href="/">
                  FYAT LUX
                </a>
              </div>
              <div>
                <ul className="navbar-nav list-style-none mr-auto flex flex-col pl-0">
                  <li className="nav-item p-2">
                    <a className="nav-link text-white" href="/">
                      <button className="bg-white py-3 px-8 font-bold text-black duration-200 hover:scale-110">
                        Gallery
                      </button>
                    </a>
                  </li>
                  <li className="nav-item p-2">
                    <a className="nav-link p-0 text-white" href="create-item">
                      <button className="bg-white py-3 px-8 font-bold text-black duration-200 hover:scale-110">
                        Sell Digital Asset
                      </button>
                    </a>
                  </li>
                  <li className="nav-item p-2">
                    <a className="nav-link p-0 text-white" href="my-assets">
                      <button className="bg-yellow-400 py-3 px-8 font-bold text-black duration-200 hover:scale-110">
                        My Digital Assets
                      </button>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative flex items-center">
              <div className="dropdown relative">
                <a
                  className="dropdown-toggle hidden-arrow flex items-center"
                  href="/"
                  id="dropdownMenuButton2"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></a>
                <ul
                  className="dropdown-menu absolute left-auto right-0 z-50 float-left m-0 mt-1 hidden hidden min-w-max list-none rounded-lg border-none bg-white bg-clip-padding py-2 text-left text-base shadow-lg"
                  aria-labelledby="dropdownMenuButton2"
                ></ul>
              </div>
            </div>
          </div>
        </nav>
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
