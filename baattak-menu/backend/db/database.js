import mongoose from "mongoose";
import { setTimeout } from 'timers/promises';

const connectDB = async () => {
    const maxRetries = 5;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            console.log(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${maxRetries})...`);
            console.log("Using connection string:", process.env.MONGO_URI);
            
            await mongoose.connect(process.env.MONGO_URI);
            
            console.log("Successfully connected to MongoDB!");
            console.log("Database name:", mongoose.connection.name);
            return;
        } catch (error) {
            console.error(`Connection attempt ${retryCount + 1} failed. Error:`, error.message);
            retryCount++;
            
            if (retryCount < maxRetries) {
                console.log(`Retrying in 2 seconds...`);
                await setTimeout(2000);
            } else {
                console.error("Maximum retry attempts reached. Could not connect to MongoDB.");
                throw error;
            }
        }
    }
};

// Add event listeners for connection events
mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully');
    console.log('MongoDB version:', mongoose.version);
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    console.error('Attempting to reconnect...');
    connectDB();
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected');
    console.error('Attempting to reconnect...');
    connectDB();
});

export default connectDB;
