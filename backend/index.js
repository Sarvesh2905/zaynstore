const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 6001;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://psarvesh29052006:test123@cluster0.6ny205w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection;

async function run() {
  try {
    await client.connect();
    collection = client.db("zaynstore").collection("products");
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}
run();


app.post("/upload", async (req, res) => {
  try {
    const data = req.body;
    const result = await collection.insertOne(data);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: "Create failed", message: error.message });
  }
});


app.get("/products", async (req, res) => {
  try {
    const products = await collection.find().toArray();
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: "Read failed", message: error.message });
  }
});


app.put("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price } = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, price } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Update failed", message: error.message });
  }
});


app.delete("/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Delete failed", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
