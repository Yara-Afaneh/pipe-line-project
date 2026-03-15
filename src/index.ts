import express from "express";
import { pool } from "./database.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import pipelineRoutes from "./routes/pipelineRoutes.js";
import { processJobs } from "./worker.js";
import "dotenv/config";

const app = express();
const PORT = 3000;

app.use(express.json());

pool.connect((err) => {
  if (err) console.error("❌ Database Connection Error:", err.message);
  else console.log("✅ Connected to Database Successfully!");
});

app.use("/webhook", webhookRoutes);
app.use("/stats", statsRoutes);
app.use("/pipelines", pipelineRoutes);

app.get("/", (req, res) => {
  res.send("Webhook Pipeline Service is Running! 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  console.log("⚙️ Worker is starting...");
  setInterval(() => {
    processJobs().catch((err) => console.error("Worker Error:", err));
  }, 10000);
});
