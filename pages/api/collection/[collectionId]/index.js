import firebase from 'firebase/app'
import { ref, runTransaction } from 'firebase/database'
import { collection, addDoc } from 'firebase/firestore';
import { realDB } from '../../../firebase/initFirebase'

export default function handler(req, res) {

  if (req.method === "POST") {
    const collection = req.query.collectionId;

    let traitCounts = {};

    const holderRes = await fetch("https://api.ethplorer.io/getTokenInfo/" + collection + "?apiKey=freekey" + item.owner + "?format=json")
    const data = await holderRes.json();
    const numHolders = await data.totalSupply;
    const holders = [...Array(numHolders).keys()];

    const items = await Promise.all(
      holders.map(async (i) => {
        const idMeta = await web3.alchemy.getNftMetadata({
          contractAddress: collection,
          tokenId: (i + 1).toString(),
        });
        const price = 0;
        const item = {
          price,
          contract: idMeta.contract.address,
          description: idMeta.description,
          id: idMeta.id.tokenId,
          uri: idMeta.tokenUri.gateway,
          metadata: idMeta.metadata,
          time: idMeta.timeLastUpdated,
          title: idMeta.title
        };
        item.image = "http://cloudflare-ipfs.com/ipfs/" + item.metadata.image.slice(7);

  
        item.metadata.attributes = item.metadata.attributes.filter(attribute => attribute.value!=="None");

        //FOR EACH ATTRIBUTE ADD ONE TO OUR EXISTING COUNTS
        item.metadata.attributes.forEach(attribute => {
          if (traitCounts.hasOwnProperty(attribute.trait_type)) {
            if (traitCounts[attribute.trait_type].hasOwnProperty(attribute.value)) {
              traitCounts[attribute.trait_type][attribute.value]++;
            } else {
              traitCounts[attribute.trait_type][attribute.value] = 1;
            }
          } else {
            traitCounts[attribute.trait_type] = {};
            traitCounts[attribute.trait_type][attribute.value] = 1;
          }
        });


        item.faction = item.metadata.attributes.filter(attribute => attribute.trait_type==="Faction")[0].value;
        item.palette = item.metadata.attributes.filter(attribute => attribute.trait_type==="Palette")[0].value.toLowerCase();
    
        item.palette = item.palette.replace(/ +/g, "");
        item.background = 'bg-' + item.palette;

        item.textcolor = (item.palette == 'angel' || 
                          item.palette == 'greenvelvet' || 
                          item.palette == 'taffy' || 
                          item.palette == 'militant' || 
                          item.palette == 'bluepill' ||
                          item.palette == 'silvercharm' || 
                          item.palette == 'whitenight' ||
                          item.palette == 'obedience') ? 'text-white' : 'text-black';
        return item;
      })
    );

    //calculate rarity of each item (LATER)

    const userCollectionRef = ref(realDB, collection + "/NFTData/NFTs");
    const traitCollectionRef = ref(realDB, collection+ "/TraitData/Traits");

    //somehow get batching to work so every 500 operations it resets the batch
    var batch = db.batch()
    items.forEach((doc) => {
      var docRef = userCollectionRef.doc(doc.id); 
      batch.set(docRef, doc);
    });

    const result = await batch.commit();

    //upload trait data
    for (const [key, value] of Object.entries(traitCounts)) {
      var traitRef = userCollectionRef.doc(key); 
      const trait = await setDoc(traitRef, value);
    }

    return res.status(200).json(traitCounts)
  } else if (req.method === "GET") {
    
  }

  
}