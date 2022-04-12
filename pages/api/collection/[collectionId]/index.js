import { writeBatch, doc } from "firebase/firestore";
import { db } from "../../../../firebase/initFirebase";
import clientPromise from '../../../../lib/mongodb';
import axios from "axios";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const collectionId = req.query.collectionId;
    console.log('here');
    //console.log(req.body);
    //req.body = "[]";

    const selectedFilters = JSON.parse(req.query.filters);
    //let test = [];
    //let body = JSON.stringify(test)
    //const selectedFilters = JSON.parse(body);
    // const selectedFilters = [{filterName: "Palette", options: ["Cold Blue", "Angel"]},
    //                         {filterName: "Pose", options: ["The Right Way"]}];
    console.log(selectedFilters);
    //console.log(req.query);

    const client = await clientPromise;
    const database = client.db("collectionData");
    const foods = database.collection("NFTs");

    const sortBy = req.query.sortBy;
    const limit = parseInt(req.query.limit);
    //const searchValue = req.query.searchValue;
    //console.log(searchValue);
    //const searchValue = "";


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
    //console.log(selectedOptions);

    //let items = [];

    //let first;
    //console.log(collectionId);
    let andList = [];
    if ("searchValue" in req.query) {
      andList.push({ $text: { $search: req.query.searchValue } });
    }
    if (selectedOptions.length !== 0) {
      selectedFilters.forEach((filter) => {
        let filter_list = filter.options.map((option) => ({
          value: option,
          trait_type: filter.filterName
        }));
        console.log(filter_list);
        andList.push({"metadata.attributes": {$in: filter_list}});

      })
    }
    let query = {};
    if (andList.length > 1) {
      query = {$and: andList};
    } else if (andList.length == 1) {
      query = andList[0];
    }
    //console.log(query);
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
    if ("skip" in req.query) {
      const skipAmt = parseInt(req.query.skip);
      cursor = foods.find(query).sort(sort).skip(skipAmt).limit(limit);
      currentCount = await foods.countDocuments(query);
    } else {
      cursor = foods.find(query).sort(sort).limit(limit);
      currentCount = await foods.countDocuments(query);
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
