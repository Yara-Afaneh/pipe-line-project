import { pool } from "./db/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    const sqlPath = path.join(__dirname, "db", "init.sql");
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, "utf8");
      await pool.query(sql);
      console.log("✅ SQL Schema initialized successfully");
    }
  } catch (err) {
    console.error("❌ Error initializing database tables:", err);
  }
};

pool.on("connect", () => {
  console.log("✅ Database Pool Connected");
});

pool.on("error", (err) => {
  console.error("❌ Database Pool Error:", err.message);
});
