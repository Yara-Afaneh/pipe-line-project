import express from "express";
import { initializeDatabase } from "./database.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import pipelineRoutes from "./routes/pipelineRoutes.js";
import { startWorker } from "./worker.js"; 
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/webhook", webhookRoutes);
app.use("/stats", statsRoutes);
app.use("/pipelines", pipelineRoutes);

app.get("/", (req, res) => {
  res.send("Yara's Webhook Pipeline Service is Running! 🚀");
});

async function bootstrap() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
      
      console.log("⚙️  Background Worker starting...");
      startWorker(); 
    });
  } catch (error) {
    console.error("❌ Failed to start the application:", error);
    process.exit(1);
  }
}

bootstrap();