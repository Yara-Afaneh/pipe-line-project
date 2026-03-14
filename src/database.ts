import { Pool } from "pg";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    const sqlPath = path.join(__dirname, 'db', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('✅ schema created successfully');
  } catch (err) {
    console.error('❌ error creating tables ', err);
  }
};
pool.connect((err) => {
  if (err) {
    console.error("❌  connection error:", err.message);
  }
  console.log("✅ connected successfully");
});
