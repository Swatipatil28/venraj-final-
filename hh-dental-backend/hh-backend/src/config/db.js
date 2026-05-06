const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 30000,  // 30s to find a server
        connectTimeoutMS: 30000,          // 30s to establish connection
        socketTimeoutMS: 45000,           // 45s for socket operations
        heartbeatFrequencyMS: 10000,      // check connection every 10s
        retryWrites: true,
        maxPoolSize: 10,
      }
    );
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected. Retrying...");
});

module.exports = connectDB;
