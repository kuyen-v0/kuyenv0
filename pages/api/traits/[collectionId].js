import clientPromise from '../../../lib/mongodb';


export default async function traitMetadata(req, res) {
  try {

    let traits = [];

    const client = await clientPromise;
    const database = client.db("collectionData");
    const traitCol = database.collection("Traits");

    const cursor = traitCol.find({});

    await cursor.forEach((doc) => {
      traits.push({ filterName: doc.attribute_name, options: doc.attribute_counts });
    })

    res.status(200).json(traits);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
