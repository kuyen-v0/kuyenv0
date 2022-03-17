import { writeBatch, collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { db} from '../../../../firebase/initFirebase'
import axios from "axios"
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const collectionId = req.query.collectionId;

    let items = [];

    async function getItems() {
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForCollection`;
      const withMetadata = "true";
      var config = {};
      let startToken = 1;
      let done = false;

      do {
        if (startToken === 1) {
          config = {
            method: 'get',
            url: `${baseURL}?contractAddress=${collectionId}&withMetadata=${withMetadata}`,
            headers: { }
          };
        } else {
          config = {
            method: 'get',
            url: `${baseURL}?contractAddress=${collectionId}&startToken=${startToken}&withMetadata=${withMetadata}`,
            headers: { }
          };
        }

        const response = await axios(config);

        if (response.data.nextToken) { 
          items = items.concat(response.data.nfts);
          startToken = response.data.nextToken;
        } else {
          items = items.concat(response.data.nfts);
          done = true;
        }
        
      } while (!done);
      return;
    }

    getItems()
    .then(async () => {
      items = items.map(item => nftTransform(item));
      let traits = traitTransform(items);
      items = items.map(item => rarityTransform(item, traits));
      await uploadNFTs(items);
      await uploadTraits(traits);
    })
    .then(() => {return res.status(200).json(traits);});
      
    function nftTransform(idMeta) {
      const price = 0;
      const item = {
        price,
        contract: idMeta.contract.address,
        description: idMeta.description,
        id: parseInt(idMeta.id.tokenId),
        uri: idMeta.tokenUri.gateway,
        metadata: idMeta.metadata,
        time: idMeta.timeLastUpdated,
        title: idMeta.title
      };
      item.image = "http://cloudflare-ipfs.com/ipfs/" + item.metadata.image.slice(7);

      item.metadata.attributes = item.metadata.attributes.filter(attribute => attribute.value!=="None");

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
    }

    function traitTransform(items) {
      let traitCounts = {};
      items.forEach((item) => {
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
      });
      return traitCounts;
    }

    function rarityTransform(item, traitJSON) {
      let rarity = 1;
      item.metadata.attributes.forEach(attribute => {
        rarity *= (traitJSON[attribute.trait_type][attribute.value]);
      });
      item.rarity=rarity;
      return item;
    }

    async function uploadNFTs(items) {
      const batchArray = [];
      batchArray.push(writeBatch(db));
      let operationCounter = 0;
      let batchIndex = 0;

      items.forEach((item) => {
        const docRef = doc(db, collectionId, "NFTData", "NFTs", item.id); 
        batchArray[batchIndex].set(docRef, item);
        operationCounter++;

        if (operationCounter === 499) {
          batchArray.push(writeBatch(db));
          batchIndex++;
          operationCounter = 0;
        }
      });

      batchArray.forEach(async batch => await batch.commit());
    }

    async function uploadTraits(traits) {
      const traitBatch = writeBatch(db);
      for (const [key, value] of Object.entries(traits)) {
        var traitRef = doc(db, collectionId, "TraitData", "Traits", key)
        traitBatch.set(traitRef, value);
      }
      await traitBatch.commit();
    }   
    }
}