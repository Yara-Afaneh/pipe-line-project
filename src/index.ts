import express from "express";
import { pool } from "./database.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

import { processJobs } from "./worker.js";

const app = express();
const PORT = 3000;

app.use(express.json());

pool.connect((err) => {
  if (err) console.error("❌ Database Connection Error:", err.message);
  else console.log("✅ Connected to Database Successfully!");
});
app.use("/webhook", webhookRoutes);
setInterval(processJobs, 10000);

app.use('/stats', statsRoutes);

app.get("/", (req, res) => {
  res.send("Webhook Pipeline Service is Running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
