const mongoose = require('mongoose');

// Connects to the database tier. URI comes from env so the same code
// works locally, in CI (service container), and in k8s (Secret/ConfigMap).
async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGO_URI || 'mongodb://localhost:27017/threetierdb';

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 8000
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
