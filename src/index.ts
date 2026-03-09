import express from "express";
import { pool } from "./database.js";

const app = express();
const PORT = 3000;

pool.connect((err, client, release) => {
  if (err) {
    return console.error("❌  connection error:", err.message);
  }
  console.log("✅ connected successfully");
  release();
});
app.get("/", (req, res) => {
  res.send("Hello Webhook Pipeline Service is Running!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
