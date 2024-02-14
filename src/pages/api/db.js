// db.js
const mongoose = require("mongoose");
const { DB_URI } = require("../../config"); // Your database URI

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.log("Already connected to the database mp.");
    return;
  }

  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to the database-mp.");
  } catch (error) {
    console.error("Error connecting to the database-mp:", error);
  }
}

module.exports = { connectToDatabase };
