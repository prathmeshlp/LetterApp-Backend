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

app.use(cors({ origin: process.env.CLIENT_URI, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/letters", letterRoutes);

app.get("/", (req, res) => {
  res.json(`Server is running on Port port ${process.env.PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
