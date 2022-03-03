import firebase from 'firebase/app'
import { ref, runTransaction } from 'firebase/database'
import { collection, addDoc } from 'firebase/firestore';
import { realDB } from '../../../firebase/initFirebase'

export default function handler(req, res) {

  if (req.method === "GET") {
    const collection = req.query.collectionId;

    const docRef = ref(realDB, collection + "/NFTData");

    //check if this is a collection that you have permission to display?
    //to ensure that someone doesn't have the ability to exhaust our storage with irrelevant collections/collections that admin does not own?

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //loop thru and get all data, populate with updated owner
      const userCollectionRef = ref(realDB, collection + "/NFTData/NFTs");
      userCollectionRef.get().then(async function(querySnapshot) {
        querySnapshot.forEach(async function(doc) {
          const tokenId = doc.id;
          const options = { address: collection, token_id: tokenId, chain: "eth" };
          const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
          item.owner = tokenIdOwners.result[0].owner_of;

          fetch("https://api.opensea.io/user/" + item.owner + "?format=json")
            .then(res => res.json())
            .then(responseJSON => {
              userCollectionRef.doc(tokenId).update({owner_name: responseJSON.username});
              res.status(200).json(item);
            });
        });

      const snapshot = await userCollectionRef.get();
      return snapshot.docs.map(doc => doc.data());
      });

      return res.status(200).json(items);
    } else {
      let traitCounts = {};

      const holderRes = await fetch("https://api.ethplorer.io/getTokenInfo/" + collection + "?apiKey=freekey" + item.owner + "?format=json")
      const data = await holderRes.json();
      const numHolders = await data.totalSupply;
      const holders = [...Array(numHolders).keys()];

      //check if collection doesn't exist already/does not have full number of tokens
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

          const options = { address: collection, token_id: tokenId, chain: "eth" };
          const tokenIdOwners = await Moralis.Web3API.token.getTokenIdOwners(options);
          item.owner = tokenIdOwners.result[0].owner_of;
      
          fetch("https://api.opensea.io/user/" + item.owner + "?format=json")
            .then(res => res.json())
            .then(responseJSON => {
              item.owner_name = responseJSON.username;
            });

          return item;
        })
      );

      //calculate rarity of each item (LATER)

      const userCollectionRef = ref(realDB, collection + "/NFTData/NFTs");
      const traitCollectionRef = ref(realDB, collection+ "/TraitData/Traits");

      //uploading batch changes
      const batchArray = [];
      batchArray.push(db.batch());
      let operationCounter = 0;
      let batchIndex = 0;

      items.forEach((doc) => {
        var docRef = userCollectionRef.doc(doc.id); 
        batchArray[batchIndex].set(docRef, doc);
        operationCounter++;

        if (operationCounter === 499) {
          batchArray.push(firestore.batch());
          batchIndex++;
          operationCounter = 0;
        }
      });

      batchArray.forEach(async batch => await batch.commit());

      //upload trait data
      for (const [key, value] of Object.entries(traitCounts)) {
        var traitRef = traitCollectionRef.doc(key); 
        const trait = await setDoc(traitRef, value);
      }
    }

    //
    return res.status(200).json(items);
  }

  
}