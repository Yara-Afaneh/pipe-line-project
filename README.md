# 🚀 Yara's Background Task Processor (Webhook System)

A robust and secure Node.js backend system designed to receive data via Webhooks and process tasks asynchronously in the background. Built with focus on scalability, security, and clean architecture.

## ✨ Key Features
- **Security-First:** Implemented API Key authentication to protect endpoints from unauthorized access.
- **Smart Background Worker:** An automated worker that polls the database for pending jobs and processes them based on their type.
- **Observability:** A dedicated `/stats` dashboard providing real-time insights into system health (Pending, Completed, and Failed jobs).
- **Clean Architecture:** Modular routing and modern database management using Drizzle ORM.

## 🛠️ Tech Stack
- **Language:** TypeScript
- **Backend:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Environment:** Node.js

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone [YOUR_REPOSITORY_LINK]
Install dependencies:

Bash
npm install
Setup Environment Variables:
Create a .env file in the root directory and add:

DATABASE_URL=your_postgresql_connection_string
WEBHOOK_SECRET=your_secure_api_key
Run the Project:

Bash
npm run dev
📊 API Endpoints
POST /webhook: Receives incoming data. (Requires x-api-key in the header).

GET /stats: Provides a JSON summary of job statistics.

Developed by Yara Afaneh.