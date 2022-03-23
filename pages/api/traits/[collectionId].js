import { getDocs, collection } from "firebase/firestore";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { db } from "../../../firebase/initFirebase";
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export default async function traitMetadata(req, res) {
  try {
    const collectionId = req.query.collectionId;

    const traitJSON = [];

    const querySnapshot = await getDocs(
      collection(db, collectionId, "TraitData", "Traits")
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      traitJSON.push({ filterName: doc.id, options: doc.data() });
    });

    res.status(200).json(traitJSON);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
