const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const itemSchema = require("./model/schema");
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const Item = mongoose.model("Item", itemSchema);

app.post("/items", async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { name, description, price } = req.body;

    console.log("Extracted fields:", { name, description, price });

    if (!name || !description || price === undefined) {
      console.log("Validation failed:", { name, description, price });
      return res
        .status(400)
        .json({ error: "All fields (name, description, price) are required" });
    }

    const newItem = new Item({ name, description, price });
    console.log("New item before save:", newItem.toObject());

    const savedItem = await newItem.save();
    console.log("Saved item:", savedItem.toObject());

    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error creating item:", err);
    res
      .status(500)
      .json({ error: "Error creating item", details: err.message });
  }
});

app.post("/items", async (req, res) => {
  try {
    const items = await Item.find();
    console.log("Retrieved items:", items);
    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res
      .status(500)
      .json({ error: "Error fetching items", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("The server is ready and running on port 3000");
});
