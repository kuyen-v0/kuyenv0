import clientPromise from '../../../../../lib/mongodb';
import axios from "axios";
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
      let config = {};
      let startToken = 1;
      let done = false;

      do {
        if (startToken === 1) {
          config = {
            method: "get",
            url: `${baseURL}?contractAddress=${collectionId}&withMetadata=${withMetadata}`,
            headers: {},
          };
        } else {
          config = {
            method: "get",
            url: `${baseURL}?contractAddress=${collectionId}&startToken=${startToken}&withMetadata=${withMetadata}`,
            headers: {},
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
    }

    getItems()
      .then(async () => {
        items = items.map((item) => nftTransform(item));
        const traits = traitTransform(items);
        items = items.map((item) => rarityTransform(item, traits));
        await uploadNFTs(items);
        await uploadTraits(traits);
      })
      .then((traits) => {
        return res.status(200).json(traits);
      });

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
        title: idMeta.title,
      };
      item.image =
        "http://cloudflare-ipfs.com/ipfs/" + item.metadata.image.slice(7);

      item.metadata.attributes = item.metadata.attributes.filter(
        (attribute) => attribute.value !== "None"
      );

      const definingTraits = {trait_naming: "Faction", trait_colorscheme: "Palette"};
      const schemeMapping = [{"trait_value": "angel", "textcolor": "white", "backgroundcolor": "#E63B2E"},
                            {"trait_value": "death", "textcolor": "black", "backgroundcolor": "#70808A"},
                            {"trait_value": "taffy", "textcolor": "white", "backgroundcolor": "#242485"},
                            {"trait_value": "forest", "textcolor": "black", "backgroundcolor": "#2B7DA3"},
                            {"trait_value": "bananas", "textcolor": "black", "backgroundcolor": "#24C2FC"},
                            {"trait_value": "coldblue", "textcolor": "black", "backgroundcolor": "#FF8226"},
                            {"trait_value": "greenvelvet", "textcolor": "white", "backgroundcolor": "#912429"},
                            {"trait_value": "militant", "textcolor": "white", "backgroundcolor": "#A63026"},
                            {"trait_value": "goldcharm", "textcolor": "black", "backgroundcolor": "#DEE0FF"},
                            {"trait_value": "silvercharm", "textcolor": "white", "backgroundcolor": "#1C383D"},
                            {"trait_value": "pearlranger", "textcolor": "black", "backgroundcolor": "#FFDB29"},
                            {"trait_value": "violetstorm", "textcolor": "black", "backgroundcolor": "#FF54BF"},
                            {"trait_value": "akira", "textcolor": "black", "backgroundcolor": "#C7C4CC"},
                            {"trait_value": "whitenight", "textcolor": "white", "backgroundcolor": "#000000"},
                            {"trait_value": "bluepill", "textcolor": "white", "backgroundcolor": "#4A4A54"},
                            {"trait_value": "obedience", "textcolor": "white", "backgroundcolor": "#636357"},
                            {"trait_value": "cherryblossom", "textcolor": "black", "backgroundcolor": "#CFD9E6"},
                            {"trait_value": "zen", "textcolor": "black", "backgroundcolor": "#ADBAC2"},
                            {"trait_value": "phoenixrising", "textcolor": "black", "backgroundcolor": "#6B8F94"},
                            {"trait_value": "indigo", "textcolor": "black", "backgroundcolor": "#4D525C"}]

      item.name = item.metadata.attributes.filter(
        (attribute) => attribute.trait_type === definingTraits["trait_naming"]
      )[0].value;
      let palette = item.metadata.attributes
        .filter((attribute) => attribute.trait_type === definingTraits["trait_colorscheme"])[0]
        .value.toLowerCase();

      let paletteNew = palette.replace(/ +/g, "");
      item.textcolor = "text-" + schemeMapping
        .filter((traitMapping) => traitMapping["trait_value"] === paletteNew)[0]
        .textcolor.toLowerCase();

      item.backgroundcolor = "bg-[" + schemeMapping
        .filter((traitMapping) => traitMapping["trait_value"] === paletteNew)[0]
        .backgroundcolor + "]";

      return item;
    }

    function traitTransform(items) {
      const traitCounts = {};
      items.forEach((item) => {
        item.metadata.attributes.forEach((attribute) => {
          if (traitCounts.hasOwnProperty(attribute.trait_type)) {
            if (
              traitCounts[attribute.trait_type].hasOwnProperty(attribute.value)
            ) {
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
      item.metadata.attributes.forEach((attribute) => {
        rarity *= traitJSON[attribute.trait_type][attribute.value];
      });
      item.rarity = Math.round(Math.pow(rarity, (1/length(item.metadata.attributes))))
      return item;
    }

    async function uploadNFTs(items) {

      const client = await clientPromise;
      const database = client.db("collectionData");
      const foods = database.collection("NFTs");


      const options = { ordered: true };
      const result = await foods.insertMany(items, options);
      console.log(`${result.insertedCount} documents were inserted`);
    }

    async function uploadTraits(traits) {

      const client = await clientPromise;
      const database = client.db("collectionData");
      const traitCol = database.collection("Traits");

      const traitBatch = [];
      for (const [key, value] of Object.entries(traits)) {
        const traitDoc = {attribute_name: key, attribute_counts: value};
        traitBatch.push(traitDoc);
      }
      const options = { ordered: true };
      const result = await traitCol.insertMany(traitBatch, options);
    }
  }
}
