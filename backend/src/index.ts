import express from "express";
import cors from "cors";
import { PORT } from "./config/env";
import indexRoutes from "@/routes/index";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/", indexRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
