import { doc, getDoc } from "firebase/firestore";
import Moralis from "moralis/node.js";
import { db } from "../../../../firebase/initFirebase";
import axios from "axios";

const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
Moralis.start({ serverUrl, appId });
// import { createAlchemyWeb3 } from "@alch/alchemy-web3";
// const web3 = createAlchemyWeb3(
//   `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
// );

export default async function tokenMetadata(req, res) {
  try {
    const collection = req.query.collectionId;
    const tokenId = req.query.tokenId;
    const docRef = doc(db, collection, "NFTData", "NFTs", tokenId);
    const docSnap = await getDoc(docRef);

    const item = docSnap.data();

    const options = { address: collection, token_id: tokenId, chain: "eth" };
    const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
    item.owner = tokenIdOwners.result[0].owner_of;

    axios.get(`https://api.opensea.io/user/${item.owner}`).then((response) => {
      if (response.username === null) {
        item.owner_name = item.owner.substring(0, 8) + "...";
        res.status(200).json(item);
      } else {
        item.owner_name = response.data.username;
        res.status(200).json(item);
      }
      return new Promise((resolve, reject) => {
        resolve(item);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
