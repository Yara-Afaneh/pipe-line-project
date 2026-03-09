import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'webhook_db',
  password: 'password',
  port: 5432,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});