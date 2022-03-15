import { writeBatch, collection, doc, getDoc, addDoc } from 'firebase/firestore';
import Moralis from "moralis"
import { collection, getDocs } from "firebase/firestore";


const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
Moralis.start({serverUrl, appId});
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export default async function traitMetadata(req, res) {
  try {    
    const collection = req.query.collectionId;
    const tokenId = req.query.tokenId;

    let traitJSON = [];

    const querySnapshot = await getDocs(collection(db, collectionId, "TraitData", "Traits"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      traitJSON.push({ filterName: doc.id, options: doc.data() });
    });

    res.status(200).json(traitJSON);

  }
  catch (err) {
    res.status(500).json({ error: err })
  }
}
