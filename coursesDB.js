import { MongoClient, ObjectId } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "exercice";

const add = async (course) => {
  await client.connect();

  const db = client.db(dbName);
  const courses = db.collection("courses");
  try {
    let liste = await courses.insertOne(course);
    console.log(liste);
  } catch (e) {
    console.log(e);
  }
  client.close();
};

const remove = async (id) => {
  await client.connect();
  const db = client.db(dbName);
  const courses = db.collection("courses");
  try {
    let supp = await courses.deleteOne({ _id: ObjectId(id) });
    console.log(supp.deletedCount);
  } catch (e) {
    console.log(e);
  }
  client.close();
};

const findAll = async () => {
  await client.connect();
  const db = client.db(dbName);
  const courses = db.collection("courses");
  try {
    let liste = await courses.find({});
    const result = await liste.toArray();
    client.close();
    return result;
  } catch (e) {
    console.log(e);
    client.close();
  }
};

export default { add, remove, findAll };
