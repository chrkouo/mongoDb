import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

const dbName = "local";

const uneFonctionAsynchrone = async () => {
  await client.connect();

  const db = client.db(dbName);
  const dogs = db.collection("dogs");

  // Create
  await dogs.insertOne({ name: "Roger" });

  await dogs.insertMany([{ name: "Togo" }, { name: "Syd" }]);

  // Retreive
  let res = await dogs.findOne({ name: "Togo" }); // Attention! Cela donne l'élément directement
  console.log(res);

  res = await dogs.find({});
  console.log(await res.toArray());

  // Update
  let updatedItems = await dogs.updateOne(
    { name: "Togo" },
    { $set: { name: "Mega-Togo" } }
  );
  console.log(updatedItems.matchedCount); // Nombre de documents qui ont été modifiés

  // Delete
  let deletedRecords = await dogs.deleteOne({ name: "Mega-Togo" });
  console.log(deletedRecords.deletedCount);

  res = await dogs.find({});
  console.log(await res.toArray());

  client.close();
};

uneFonctionAsynchrone();
