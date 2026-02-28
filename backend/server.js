require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const Contestant = require("./models/Contestant");

// only for testing purpose
app.get("/", (req, res) => {
  res.send("API running");
});

// Get contestants
app.get("/contestants", async (req, res) => {
  try {
    const data = await Contestant.find();

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "There Are No Contestants",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Vote API
app.post("/vote/:id", async (req, res) => {
  const id = req.params.id;

  const contestant = await Contestant.findById(id);
  if (!contestant) return res.status(404).send("Not found");
  // for improvement add try catch block
  contestant.votes += 1;
  await contestant.save();

  res.json({ message: "Vote counted" });
});

// Add contestants (run once)
app.post("/add", async (req, res) => {
  // for improvement add try catch block
  const { name, image } = req.body; //i changed here @sai for better functionality mostly to be used in admin panel if made

  const newContestant = new Contestant({ name, image }); //i changed here @sai for better functionality mostly to be used in admin panel if made
  await newContestant.save();

  res.send("Added");
});

// delete one contestant
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Contestant.findByIdAndDelete(id);

    const data = await Contestant.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// rest votes for one contestant
app.patch("/reset/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedContestant = await Contestant.findByIdAndUpdate(
      id,
      { votes: 0 },
      { new: true },
    );

    if (!updatedContestant) {
      return res.status(404).json({ message: "Contestant not found" });
    }

    res.json({
      message: "Vote reset successfully",
      contestant: updatedContestant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// reset votes for all contestant
app.patch("/resetAll", async (req, res) => {
  try {
    const { passkey } = req.body;

    if (passkey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid passkey" });
    }

    await Contestant.updateMany({}, { votes: 0 });

    res.json({ message: "All votes reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete all contestant
app.delete("/deleteAll", async (req, res) => {
  try {
    const { passkey } = req.body;

    if (passkey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid passkey" });
    }
    await Contestant.deleteMany({});
    res.json({ message: "All contestants deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
// this takes a default port of 5000 if no PORT is specified in the environment variables, which is common for local development. In production, you would typically set the PORT environment variable to the desired port number.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
