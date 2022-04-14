import clientPromise from '../../../../lib/mongodb';
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const collectionId = req.query.collectionId;

    const selectedFilters = JSON.parse(req.query.filters);

    const client = await clientPromise;
    const database = client.db("collectionData");
    const foods = database.collection("NFTs");

    const sortBy = req.query.sortBy;
    const limit = parseInt(req.query.limit);


    const unpackSelectedFilters = (selectedFilters) => {
      return selectedFilters
        .map((filter) =>
          filter.options.map((option) => ({
            value: option,
            trait_type: filter.filterName
          }))
        )
        .flat();
    };
    const selectedOptions = unpackSelectedFilters(selectedFilters);

    let andList = [];
    if ("searchValue" in req.query) {
      andList.push({ title: {$regex: req.query.searchValue}})
    }
    if (selectedOptions.length !== 0) {
      selectedFilters.forEach((filter) => {
        let filter_list = filter.options.map((option) => ({
          value: option,
          trait_type: filter.filterName
        }));
        andList.push({"metadata.attributes": {$in: filter_list}});

      })
    }
    let query = {};
    if (andList.length > 1) {
      query = {$and: andList};
    } else if (andList.length == 1) {
      query = andList[0];
    }

    let currentCount;
    let sort;
    if (sortBy === "rarity") {
      sort = { rarity : 1};
    } else {
      sort = { id : 1};
    }
    let cursor;
    if ("skip" in req.query) {
      const skipAmt = parseInt(req.query.skip);
      cursor = foods.find(query).sort(sort).skip(skipAmt).limit(limit);
      currentCount = await foods.countDocuments(query);
    } else {
      cursor = foods.find(query).sort(sort).limit(limit);
      currentCount = await foods.countDocuments(query);
    }

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
