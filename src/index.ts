import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/auth";
import letterRoutes from "./routes/letter";

const app = express();

app.use(cors({
  origin: 'https://letter-app-client.vercel.app',
  credentials: true
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/letters", letterRoutes);

app.get("/", (req, res) => {
  res.json(`Server is running on Port port ${process.env.PORT}`);
});

let dbConnected = false;
const connectDB = async () => {
  if (dbConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/letterapp', {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    dbConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; 
  }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;