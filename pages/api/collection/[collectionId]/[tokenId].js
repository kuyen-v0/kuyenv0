import { doc, getDoc } from "firebase/firestore";
import Moralis from "moralis";
import { db } from "../../../../firebase/initFirebase";

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

    // const options = { address: collection, token_id: tokenId, chain: "eth" };
    // const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
    // item.owner = tokenIdOwners.result[0].owner_of;
    // console.log(item.owner);

    // fetch("https://api.opensea.io/user/" + item.owner + "?format=json")
    //   .then(res => res.json())
    //   .then(responseJSON => {
    //     if (responseJSON.username === null) {
    //       item.owner_name = item.owner.substring(0, 8) + "...";
    //     } else {
    //       item.owner_name = responseJSON.username;
    //     }
    //     //item.owner_name = responseJSON.username;
    //     res.status(200).json(item);
    //   });

    item.owner_name = "PLACEHOLDER";
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
