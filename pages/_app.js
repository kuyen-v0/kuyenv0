import '../styles/globals.css'
import Link from 'next/link'
import Script from 'next/script';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }) {
  return (

    <ChakraProvider>
      <Head>
      <link rel="stylesheet" href="https://unpkg.com/flowbite@1.3.3/dist/flowbite.min.css" />
      </Head>


    <div>
      <Script src="https://unpkg.com/flowbite@1.3.3/dist/flowbite.js"></Script>


    <nav className="p-6">
    <p className="text-4xl font-bold">Kuyen Marketplace</p>
    <div className="flex mt-4">
      <Link href="/">
        <a className="mr-4 text-pink-500">
          Gallery
        </a>
      </Link>
      <Link href="/create-item">
        <a className="mr-6 text-pink-500">
          Sell Digital Asset
        </a>
      </Link>
      <Link href="/my-assets">
        <a className="mr-6 text-pink-500">
          My Digital Assets
        </a>
      </Link>
    </div>
  </nav>
  <Component {...pageProps} />
  </div>
  
  </ChakraProvider>
  )

}

export default MyApp
