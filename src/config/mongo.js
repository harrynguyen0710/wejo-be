const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    console.log("🔵 Connecting to MongoDB...", process.env.MONGODB_URI);
    await mongoose.connect('mongodb://localhost:27017/gameapp');

    console.log("🟢 Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process on connection failure
  }
};

module.exports = connectMongo;
