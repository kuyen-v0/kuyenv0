import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import Script from 'next/script'
import Head from 'next/head'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from '@chakra-ui/react'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.error)
  }
  return data
}

export default function TokenData() {
  

  const { query } = useRouter()
  const { data } = useSWR(
    `/api/collection/${query.collectionId}/${query.tokenId}`,
    fetcher
  )

  useEffect(() => {
    import("flowbite");
  }, []);

  //if (data.error) return <div>{error.message}</div>
  if (!data) {return <div>Loading...</div>}
  //  console.log(data);
  //}

  console.log(data);


  return(
    
    <div className="flex flex-wrap box-border justify-around max-w-3xl min-h-full pt-7 px-5 pb-5 mx-auto my-0">
        <script src="../../../../node_modules/flowbite/dist/flowbite.js"></script>
        <script src="https://unpkg.com/flowbite@1.3.4/dist/flowbite.js"></script>
      <div className="block md:sticky md:inline-bloc md:w-1/2 align-top mx-7 my-1 w-3/12 px-7">
        <iframe
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          height="500"
          sandbox="allow-scripts"
          src={`https://fyatlux-viewer.web.app?tokenID=${query.tokenId}`}
          width="100%"
        >
        </iframe>
        <p>{data.title}</p>
      </div>

      

      <div className="px-20 mt-1 w-1/2">
        <div className="justify-start items-center mb-3">
          <p className="text-5xl mb-2">{data.title}</p>
          <div className="flex">
          <span className="text-red-500">{data.faction[0].value}</span>
          <p>&nbsp;owned by&nbsp;</p>
          <a href={`https://opensea.io/${data.owner_name}`} target="_blank" title="View on OpenSea" className="text-red-500 no-underline hover:underline">
            {data.owner_name}
          </a>
          </div>
        </div>

        <Accordion className="mb-3">

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          <p className="font-bold">Properties</p>
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
      {data.metadata.attributes.map((attribute, i) => (
          <div key={i} className="border border-black content-center">
            <div class="text-center text-sm text-blue-600">{attribute.trait_type}</div>
            <div class="text-center">{attribute.value}</div>
          </div>
        ))}

      </div>
        
    </AccordionPanel>
  </AccordionItem>

  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex='1' textAlign='left'>
          <p className="font-bold">Details</p>
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>


      <div className="pt-5">
      <div className="flex justify-between">
        Token Address
        <span>
          <a href={`https://etherscan.io/token/${query.collectionId}`} target="_blank" title="View on Etherscan" className="text-blue-500 no-underline hover:underline">
            {data.contract}
          </a>
        </span>
      </div>
      <div className="flex justify-between">
        Token ID
        <span>
          <a href={`https://etherscan.io/token/${query.collectionId}?a=${query.tokenId}`} target="_blank" title="View Activity on Etherscan" className="text-blue-500 no-underline hover:underline">
            {query.tokenId}
          </a>
        </span>
      </div>
      </div>
    </AccordionPanel>
  </AccordionItem>
</Accordion>
      
      
      <div className="pt-5">
      <button class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
        <a href={`https://opensea.io/assets/${query.collectionId}/${query.tokenId}`} target="_blank" title="View on OpenSea" className="back-green button view-opensea">
          VIEW ON OPENSEA
        </a>
      </button>
        

      </div>


<div id="accordion-collapse" data-accordion="collapse">
  <h2 id="accordion-collapse-heading-1">
    <button type="button" class="flex items-center focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 justify-between p-5 w-full font-medium text-left border border-gray-200 dark:border-gray-700 border-b-0 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-xl" data-accordion-target="#accordion-collapse-body-1" aria-expanded="true" aria-controls="accordion-collapse-body-1">
      <span>What is Flowbite?</span>
      <svg data-accordion-icon class="w-6 h-6 shrink-0 rotate-180" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
  </h2>
  <div id="accordion-collapse-body-1" aria-labelledby="accordion-collapse-heading-1">
    <div class="p-5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 border-b-0">
      <p class="mb-2 text-gray-500 dark:text-gray-400">Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.</p>
      <p class="text-gray-500 dark:text-gray-400">Check out this guide to learn how to <a href="https://flowbite.com/docs/getting-started/introduction/" target="_blank" class="text-blue-600 dark:text-blue-500 hover:underline">get started</a> and start developing websites even faster with components on top of Tailwind CSS.</p>
    </div>
  </div>
  <h2 id="accordion-collapse-heading-2">
    <button type="button" class="flex items-center focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 justify-between p-5 w-full font-medium border border-gray-200 dark:border-gray-700 border-b-0 text-left text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-collapse-body-2" aria-expanded="false" aria-controls="accordion-collapse-body-2">
      <span>Is there a Figma file available?</span>
      <svg data-accordion-icon class="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
  </h2>
  <div id="accordion-collapse-body-2" class="hidden" aria-labelledby="accordion-collapse-heading-2">
    <div class="p-5 border border-gray-200 dark:border-gray-700 border-b-0">
      <p class="mb-2 text-gray-500 dark:text-gray-400">Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.</p>
      <p class="text-gray-500 dark:text-gray-400">Check out the <a href="https://flowbite.com/figma/" target="_blank" class="text-blue-600 dark:text-blue-500 hover:underline">Figma design system</a> based on the utility classes from Tailwind CSS and components from Flowbite.</p>
    </div>
  </div>
  <h2 id="accordion-collapse-heading-3">
    <button type="button" class="flex items-center border focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 border-gray-200 dark:border-gray-700 justify-between p-5 w-full font-medium text-left text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" data-accordion-target="#accordion-collapse-body-3" aria-expanded="false" aria-controls="accordion-collapse-body-3">
      <span>What are the differences between Flowbite and Tailwind UI?</span>
      <svg data-accordion-icon class="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
    </button>
  </h2>
  <div id="accordion-collapse-body-3" class="hidden" aria-labelledby="accordion-collapse-heading-3">
    <div class="p-5 border border-gray-200 dark:border-gray-700 border-t-0">
      <p class="mb-2 text-gray-500 dark:text-gray-400">The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.</p>
      <p class="mb-2 text-gray-500 dark:text-gray-400">However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no technical reason stopping you from using the best of two worlds.</p>
      <p class="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
      <ul class="list-disc pl-5 dark:text-gray-400 text-gray-500">
        <li><a href="https://flowbite.com/pro/" target="_blank" class="text-blue-600 dark:text-blue-500 hover:underline">Flowbite Pro</a></li>
        <li><a href="https://tailwindui.com/" rel="nofollow" target="_blank" class="text-blue-600 dark:text-blue-500 hover:underline">Tailwind UI</a></li>
      </ul>
    </div>
  </div>
</div>
      </div>

      
    </div>
  )


}