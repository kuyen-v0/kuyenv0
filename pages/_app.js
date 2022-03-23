import "../styles/globals.css";
import Script from "next/script";
import Head from "next/head";

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

        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
