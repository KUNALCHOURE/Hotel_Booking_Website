// ES Module way to load environment variables
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Import routes
import listingRoutes from "./routes/listings.js";
import reviewsRoutes from "./routes/reviews.js";
import userRoutes from "./routes/user.js";

// Import models and utilities
import Apierror from "./utils/Apierror.js"; // Ensure this file exists

const port = process.env.PORT || 3030;
const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
mongoose.connect(dbUrl)
    .then(() => console.log(" Connected to MongoDB"))
    .catch((err) => console.error(" MongoDB connection error:", err));

// Middleware

app.use(cookieParser());
// CORS Middleware
app.use(cors({
    origin:["https://prime-stays.vercel.app","http://localhost:5173" ], 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],  
    allowedHeaders: ["Content-Type", "Authorization"]  
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Serve Images from Public Folder
app.use("/images", express.static("public/images"));

//  API Routes
app.use("/api/listings", listingRoutes);
app.use("/api/listing", reviewsRoutes);  
app.use("/api/auth", userRoutes);
app.get("/api/ping", (req, res) => {
    res.status(200).send("pong");
  });
//  404 Handler for Invalid Routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        status: 404,
        message: "Route not found",
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (err instanceof Apierror) {
        return res.status(err.statuscode).json({
            success: false,
            status: err.statuscode,
            message: err.message || "An error occurred",
            errors: err.errors || [],
        });
    }

    res.status(500).json({
        success: false,
        status: 500,
        message: "Something went wrong",
        errors: [],
    });
});

// ✅ Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));
