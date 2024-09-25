const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const Item = require("./model/item");
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

app.get("/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Error fetching item" });
  }
});

app.post("/items", async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newItem = new Item({ name, description, price });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    next(err);
    res.status(500).json({ error: "Error creating item" });
  }
});
// update with put 
app.put("/items/:id", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Error updating item" });
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error deleting item" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(3000, () => {
  console.log("The server is ready and running on port 3000");
});
