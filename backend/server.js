require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const Contestant = require("./models/Contestant");



// Get contestants
app.get("/contestants", async (req, res) => {
  const data = await Contestant.find();
  res.json(data);
});



// Vote API
app.post("/vote/:id", async (req, res) => {
  const id = req.params.id;

  const contestant = await Contestant.findById(id);
  if (!contestant) return res.status(404).send("Not found");

  contestant.votes += 1;
  await contestant.save();

  res.json({ message: "Vote counted" });
});


// Add contestants (run once)
app.post("/add", async (req, res) => {
  const { name,image } = req.body; //i changed here @sai for better functionality mostly to be used in admin panel if made

  const newContestant = new Contestant({ name,image });  //i changed here @sai for better functionality mostly to be used in admin panel if made
  await newContestant.save();

  res.send("Added");
});

app.delete("/deleteAll", async (req, res) => {
  await Contestant.deleteMany({});
  res.send("All contestants deleted");
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Contestant.findByIdAndDelete(id);

    const data = await Contestant.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;  
// this takes a default port of 5000 if no PORT is specified in the environment variables, which is common for local development. In production, you would typically set the PORT environment variable to the desired port number.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
