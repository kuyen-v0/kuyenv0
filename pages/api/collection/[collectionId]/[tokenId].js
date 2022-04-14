import Moralis from "moralis/node.js";
import clientPromise from '../../../../lib/mongodb';
import axios from "axios";

const serverUrl = process.env.MORALIS_SERVER_URL;
const appId = process.env.MORALIS_APP_ID;
Moralis.start({ serverUrl, appId });

export default async function tokenMetadata(req, res) {
  try {
    const collection = req.query.collectionId;
    const tokenId = req.query.tokenId;

    const client = await clientPromise;
    const database = client.db("collectionData");
    const foods = database.collection("NFTs");

    // Query for a movie that has the title 'The Room'
    const query = { id: parseInt(req.query.tokenId) };

    const item = await foods.findOne(query);

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
