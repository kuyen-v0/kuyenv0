import "../styles/globals.css";
import Script from "next/script";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/flowbite@1.3.3/dist/flowbite.min.css"
        />
        <link href="../styles/output.css" rel="stylesheet"></link>
      </Head>

      <div>
        <Script src="https://unpkg.com/flowbite@1.3.3/dist/flowbite.js"></Script>

        <nav className="navbar navbar-expand-lg navbar-light relative flex w-full flex-wrap items-center justify-between bg-gray-900 py-3 text-gray-200 shadow-lg">
          <div className="container-fluid flex w-full flex-wrap items-center justify-between px-6">
            <button
              className="navbar-toggler border-0 bg-transparent py-2 px-2.5 text-gray-200 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent1"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="bars"
                className="w-6"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
                ></path>
              </svg>
            </button>
            <div
              className="collapse navbar-collapse flex-grow items-center"
              id="navbarSupportedContent1"
            >
              <a className="pr-2 text-xl font-semibold text-white" href="/">
                Kuyen Marketplace
              </a>
              <ul className="navbar-nav list-style-none mr-auto flex flex-col pl-0">
                <li className="nav-item p-2">
                  <a
                    className="nav-link text-white opacity-60 hover:opacity-80 focus:opacity-80"
                    href="/"
                  >
                    Gallery
                  </a>
                </li>
                <li className="nav-item p-2">
                  <a
                    className="nav-link p-0 text-white opacity-60 hover:opacity-80 focus:opacity-80"
                    href="create-item"
                  >
                    Sell Digital Asset
                  </a>
                </li>
                <li className="nav-item p-2">
                  <a
                    className="nav-link p-0 text-white opacity-60 hover:opacity-80 focus:opacity-80"
                    href="my-assets"
                  >
                    My Digital Assets
                  </a>
                </li>
              </ul>
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
