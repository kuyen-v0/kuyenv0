import { NFT_DATA } from "./nft-data";

const NUM_NFTS = 1;
const COLLECTION_ID = '0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d';
let ids = [...Array(30).keys()].splice(1);
// let ids=[23]

const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

async function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export async function script() {
  // const datas = [];
  // for (let id of ids) {
  //   let data = await fetcher(
  //     '/api/collection/0x14c4471a7f6dcac4f03a81ded6253eaceff15b3d/'+id.toString()
  //   );
  //   datas.push(data);
  //   await delay(500);
  // }
  // console.log(datas);

  // let st = JSON.stringify(datas);
  // console.log(st);
  let m = JSON.parse(NFT_DATA);
  let traitTypesToValues = {};
  for (let id of m) {
    for (let att of id.metadata.attributes) {
      if (!(att.trait_type in traitTypesToValues)) {
        traitTypesToValues[att.trait_type] = [];
      }

      if (!traitTypesToValues[att.trait_type].includes(att.value)) {
        traitTypesToValues[att.trait_type].push(att.value);
      }
    }
  }

  let filters = [];
  for (let [name, options] of Object.entries(traitTypesToValues)) {
    filters.push({
      filterName: name,
      filterType: {
        type: 'checkboxes',
        options: options,
      }
    });
  }

  // console.log(JSON.stringify(filters));
  
}