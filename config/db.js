require('dotenv').config(); // Load environment variables
const { MongoClient } = require('mongodb'); // Import MongoDB client

// Get the MongoDB URI from the .env file
const uri = process.env.MONGODB_URI;

// Create a new MongoClient
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect(); // Establish a connection
        console.log('Connected to MongoDB');

        // Optionally, return a reference to a specific database
        const db = client.db('ntc_bus_database'); // Replace 'ntc_database' with your database name
        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit on failure
    }
}

// Export the connection function and client
module.exports = { connectDB, client };