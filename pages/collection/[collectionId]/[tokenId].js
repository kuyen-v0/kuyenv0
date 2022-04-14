import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { findIconDefinition, library, icon } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fas, far, fab);

import LoadingPage from "../../../components/LoadingPage";
import PageTemplate from "../../../components/PageTemplate";
import OpenSeaButton from "../../../components/OpenSeaButton";
import EtherscanButton from "../../../components/EtherscanButton";
import { Snackbar, SnackbarContent } from "@mui/material";

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.error);
  }
  return data;
};

export default function TokenData() {
  const { query } = useRouter();
  const { data } = useSWR(
    `/api/collection/${query.collectionId}/${query.tokenId}`,
    fetcher
  );

  const [showSnackbar, setShowSnackbar] = useState(true);

  let page;
  console.log(data);
  if (!data) {
    page = (
      <>
        <div>
          <div>
            <div>
              <LoadingPage />
            </div>
            <style output jsx>{`
              html,
              body,
              body > div:first-child,
              div#__next,
              div#__next > div {
                height: 100%;
              }
            `}</style>
          </div>
        </div>
      </>
    );
  } else {
    page = (
        <div
          className={`m-0 flex h-screen justify-around bg-[#fafafa]`}
        >
          <Head>
            <title>NFT Details</title>
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
          </Head>
          <div className="block w-1/2 align-top md:sticky md:inline-block">
            <Snackbar
              open={showSnackbar}
              autoHideDuration={4000}
              onClose={() => setShowSnackbar(false)}
              action={() => {}}
            >
              <SnackbarContent
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  color: "black",
                  opacity: "20",
                }}
                message="Click and drag to move me around!"
              />
            </Snackbar>

            <iframe
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              height="100%"
              sandbox="allow-scripts"
              src={`https://fyatlux-viewer.web.app?tokenID=${query.tokenId}`}
              width="100%"
            ></iframe>
          </div>

          <div className="mt-1 w-1/2 overflow-y-scroll px-10">
            <div className="items-center justify-start rounded bg-white bg-opacity-20 px-3 py-2">
              <p className="mb-2 text-4xl">
                <b>{`#${query.tokenId}`} //</b>
              </p>
              <p className="mb-2 text-xs">Fyat Lux</p>
              {data.owner_name && (
                <div className="flex text-sm">
                  <span className="font-bold">{data.faction}</span>
                  <p>&nbsp;owned by&nbsp;</p>
                  <a
                    href={`https://opensea.io/${data.owner_name}`}
                    target="_blank"
                    title="View Owner on OpenSea"
                    className="italic no-underline hover:underline"
                  >
                    {data.owner_name}
                  </a>
                </div>
              )}
            </div>

            <div className="flex pt-5">
              <div className="mr-4 flex items-center">
                <OpenSeaButton
                  link={`https://opensea.io/assets/${query.collectionId}/${query.tokenId}`}
                />
                <p className="ml-1 text-sm">Buy on OpenSea</p>
              </div>
              <div className="flex items-center">
                <EtherscanButton
                  link={`https://etherscan.io/token/${query.collectionId}?a=${query.tokenId}`}
                />
                <p className="ml-1 text-sm">View on Etherscan</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="leading-24 text-2xl font-bold">Properties //</div>
              <div className="rounded-12 bg-gray-4 mt-1 mb-3 py-1">
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3">
                  {data.metadata.attributes.map((attribute, i) => (
                    <li
                      key={i}
                      className="flex w-full content-center items-center rounded bg-white bg-opacity-20 py-2 px-2 shadow-2xl duration-300 hover:scale-105"
                    >
                      <FontAwesomeIcon
                         icon = {icon(findIconDefinition({ iconName: attribute.trait_type.toLowerCase() }))}

                      />
                      <div className="ml-2">
                        <p className="text-2xs mr-auto inline-block flex items-center tracking-wider opacity-60">
                          <span className="pt-px">{attribute.trait_type}:</span>
                        </p>
                        <p className="font-600 ml-auto text-xs uppercase">
                          <b>{attribute.value}</b>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
    );
  }
  return <PageTemplate page={page} navProps={{ bg: data?.background }} />;
}
