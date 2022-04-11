import { writeBatch, doc } from "firebase/firestore";
import { db } from "../../../../firebase/initFirebase";
import axios from "axios";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const collectionId = req.query.collectionId;

    const selectedFilters = JSON.parse(req.body);

    const sortBy = req.query.sortBy;
    const limit = req.query.limit;
    const searchValue = req.query.searchValue;


    const unpackSelectedFilters = (selectedFilters) => {
      return selectedFilters
        .map((filter) =>
          filter.options.map((option) => ({
            trait_type: filter.filterName,
            value: option,
          }))
        )
        .flat();
    };
    const selectedOptions = unpackSelectedFilters(selectedFilters);

    //let items = [];

    //let first;
    console.log(collectionId);
    let andList = [];
    if (searchValue !== "") {
      andList.push({ $text: { $search: searchValue } });
    }
    if (selectedOptions.length !== 0) {
      selectedFilters.forEach((filter) => {
        let filter_list = filter.options.map((option) => ({
          trait_type: filter.filterName,
          value: option,
        }));
        andList.push({"metadata.attributes": { $in: filter_list}});

      })
    }
    let query = {};
    if (andList.length > 0) {
      query = {$and: andList};
    }
    //const currentCount = await movies.countDocuments(query);
    let currentCount;
    //setTotal(currentCount);
    let sort;
    if (sortBy === "rarity") {
      sort = { rarity : 1};
    } else {
      sort = { id : 1};
    }
    //const limit = 20;
    let cursor;
    if (skip in req.query) {
      const skipAmt = req.query.skip;
      cursor = foods.find(query).sort(sort).skip(skipAmt).limit(limit);
      currentCount = 0;
    } else {
      cursor = foods.find(query).sort(sort).limit(limit);
      currentCount = await movies.countDocuments(query);
    }
    //const firstResult = await getDocs(first);
    let firstItems = [];
    await cursor.forEach((doc) => {
      firstItems.push(doc);
    });

    const data = {
      items: firstItems,
      total: currentCount
    };

    res.json(data);

    
  }
}
