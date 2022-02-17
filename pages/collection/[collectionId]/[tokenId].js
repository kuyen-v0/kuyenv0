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


      </div>

      
    </div>
  )


}