import express from "express";
import cors from "cors";
import userRoute from "./routes/user";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoute);
