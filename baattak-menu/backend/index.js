import dotenv from "dotenv";
dotenv.config();

import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/database.js";
import CartRoutes from "./routes/Cart.routes.js";
import UserRoutes from "./routes/User.routes.js";
import DishRoutes from './routes/Dish.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables

console.log("SMTP ENV:", {  
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? "✅ Loaded" : "❌ Not loaded",
  });
  

const app = express();

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Serve uploads directory as static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS Configuration
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://baattak.vercel.app"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Allow sending cookies and other credentials
    allowedHeaders: ['Content-Type', 'Authorization'], // Include custom headers if needed
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Routes
app.use("/api/v1/customer", CartRoutes);
app.use("/api/v1/customer", UserRoutes);
app.use("/api/v1/dishes", DishRoutes);

// Database connection and server start
const port = process.env.PORT || 3002;

app.listen(port, async () => {
    try {
        console.log("Attempting to connect to database...");
        console.log("Environment variables:");
        console.log("PORT:", process.env.PORT);
        console.log("MONGO_URI:", process.env.MONGO_URI || 'Not set');
        
        await connectDB();
        console.log(`Server is running on port ${port}`);
        console.log("Database connection successful!");
    } catch (error) {
        console.error("Failed to connect to the database:");
        console.error("Error message:", error.message);
        console.error("Stack trace:", error.stack);
        process.exit(1); // Exit the process if the database connection fails
    }
});
