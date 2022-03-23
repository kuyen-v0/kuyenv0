import { NFT_DATA } from "./nft-data";

const NUM_NFTS = 1;
const COLLECTION_ID = "0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d";
const ids = [...Array(30).keys()].splice(1);
// let ids=[23]

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

async function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function script() {
  const m = JSON.parse(NFT_DATA);
  const traitTypesToValues = {};
  for (const id of m) {
    for (const att of id.metadata.attributes) {
      if (!(att.trait_type in traitTypesToValues)) {
        traitTypesToValues[att.trait_type] = [];
      }

      if (!traitTypesToValues[att.trait_type].includes(att.value)) {
        traitTypesToValues[att.trait_type].push(att.value);
      }
    }
  }

  const filters = [];
  for (const [name, options] of Object.entries(traitTypesToValues)) {
    filters.push({
      filterName: name,
      filterType: {
        type: "checkboxes",
        options: options,
      },
    });
  }
}
