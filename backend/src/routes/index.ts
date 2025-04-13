import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Crypto Bubble API" });
});

export default router;
