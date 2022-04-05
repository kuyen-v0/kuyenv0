import { useState } from "react";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  return (
    <div className="flex justify-center">
      <div className="bg-coldblue"></div>
      <div className="bg-indigo"></div> 
      <div className="bg-angel"></div> 
      <div className="bg-greenvelvet"></div> 
      <div className="bg-pearlranger"></div> 
      <div className="bg-violetstorm"></div>
      <div className="bg-akira"></div>
      <div className="bg-forest"></div>
      <div className="bg-death"></div>
      <div className="bg-taffy"></div>
      <div className="bg-whitenight"></div>
      <div className="bg-bluepill"></div>
      <div className="bg-obedience"></div>
      <div className="bg-bananas"></div>
      <div className="bg-goldcharm"></div>
      <div className="bg-silvercharm"></div>
      <div className="bg-cherryblossom"></div>
      <div className="bg-zen"></div>
      <div className="bg-phoenixrising"></div>
      <div className="bg-militant"></div>
      <Head>
        <title>My Assets</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
    </div>
  );
}