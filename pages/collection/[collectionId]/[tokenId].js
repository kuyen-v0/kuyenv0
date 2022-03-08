import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import useSWR from "swr";
import LoadingPage from "../../../components/LoadingPage";

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

  useEffect(() => {}, []);

  if (!data) {
    return (
      <>
        <div>
          <div>
            <div>
              <LoadingPage />
            </div>
            <style global jsx>{`
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
  }

  return (
    <>
      <div
        className={`mx-auto my-0 box-border flex h-screen justify-around px-5 pt-7 pb-5 ${data.textcolor} ${data.background}`}
      >
        <Head>
          <title>NFT Details</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div className="mx-7 my-1 block w-1/2 px-7 align-top md:sticky md:inline-block">
          <iframe
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            height="100%"
            sandbox="allow-scripts"
            src={`https://fyatlux-viewer.web.app?tokenID=${query.tokenId}`}
            width="100%"
          ></iframe>
        </div>

        <div className="mt-1 w-1/2 px-20">
          <div className="mb-3 items-center justify-start">
            <p className="mb-2 text-xs">Fyat Lux</p>
            <p className="mb-2 text-4xl">{`#${query.tokenId}`}</p>
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
          </div>

          <div className="mt-5">
            <div className="leading-24 mb-3 text-2xl font-bold">Properties</div>
            <div className="rounded-12 bg-gray-4 mt-3 mb-3 overflow-hidden py-1">
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.metadata.attributes.map((attribute, i) => (
                  <li
                    key={i}
                    className="flex w-full content-center items-center bg-white bg-opacity-10 py-2 px-3"
                  >
                    {/* <img
                      className="w-8 pr-2"
                      src={`/filtericons/Black/${attribute.trait_type}.png`}
                    /> */}
                    <div>
                      <p className="text-2xs mr-auto inline-block flex items-center font-mono uppercase tracking-wider opacity-60">
                        <span className="pt-px">{attribute.trait_type}:</span>
                      </p>
                      <p className="font-600 ml-auto text-xs uppercase">
                        {attribute.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex pt-5">
            <button className="mr-2 mb-2 rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
              <a
                href={`https://opensea.io/assets/${query.collectionId}/${query.tokenId}`}
                target="_blank"
                title="View on OpenSea"
                className="back-green button view-opensea"
              >
                VIEW ON OPENSEA
              </a>
            </button>
            <button className="mr-2 mb-2 rounded-lg bg-purple-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-800 focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
              <a
                href={`https://etherscan.io/token/${query.collectionId}?a=${query.tokenId}`}
                target="_blank"
                title="View Activity on Etherscan"
                className="back-green button view-etherscan"
              >
                VIEW ON ETHERSCAN
              </a>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
