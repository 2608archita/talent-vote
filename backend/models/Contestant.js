const mongoose = require("mongoose");

const ContestantSchema = new mongoose.Schema({
  name: String,
  image: String,
  votes: {
    type: Number,
    default: 0
  }                     
});

module.exports = mongoose.model("Contestant", ContestantSchema);

