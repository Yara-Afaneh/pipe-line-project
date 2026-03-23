Markdown

# 🚀 Webhook-Driven Task Processing Pipeline

A robust, asynchronous task processing system built with **TypeScript**, **Node.js**, and **PostgreSQL**. This service functions as a simplified automation engine (similar to Zapier) where inbound webhooks trigger customizable data processing actions and deliver results to multiple subscribers.

---

## 🏗️ Architecture & Design Decisions

The system follows a **Producer-Consumer** architecture to ensure scalability and reliability:

1.  **Ingestion Layer (The Producer):** Fast Express.js routes that validate incoming webhooks and queue them immediately into the database. This ensures a low latency response (202 Accepted) for the webhook source.
2.  **Processing Layer (The Worker):** A background worker process that polls the database for `pending` jobs, applies the requested transformation logic, and handles multi-destination delivery.
3.  **Data Layer:** PostgreSQL managed via **Drizzle ORM** for type-safe queries. I implemented an automated schema initialization strategy using `init.sql` to ensure the environment is consistent across different machines.
ط
---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Tools:** Axios (for delivery), Dotenv, Nodemon

---

## 📊 Database Schema

The system is built around 4 core entities:

- **Pipelines:** Defines the source and the type of action to be performed.
- **Subscribers:** Stores the destination URLs for each pipeline.
- **Jobs:** The queue of incoming tasks and their current processing status.
- **Deliveries:** A detailed log of each delivery attempt to subscribers, providing audit trails and error tracking.

---

## ✨ Processing Actions

The worker supports three distinct processing "Actions" before delivering data:

1.  `UPPERCASE`: Converts all string values in the JSON payload to uppercase.
2.  `TRANSFORM`: Injects system metadata and processing timestamps into the payload.
3.  `CLEANSE`: Automatically removes any keys with `null` or `undefined` values to ensure clean data delivery.

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- PostgreSQL database

### 2. Installation

```bash
npm install
3. Environment Setup
Create a .env file in the root directory:

DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db
WEBHOOK_SECRET=YourSecureSecretKey
PORT=3000
4. Running the Project
Bash
# Development mode
npm run dev
📡 API Reference
Create a Pipeline
POST /pipelines

JSON
{
  "name": "Data Transformer",
  "actionType": "UPPERCASE",
  "subscriberUrls": ["[https://webhook.site/your-id](https://webhook.site/your-id)"]
}
Inbound Webhook
POST /webhook/:pipelineId

Header: x-api-key: YourSecureSecretKey

System Stats
GET /stats

Returns an overview of job statuses (pending, completed, failed).

🛡️ Reliability & Error Handling
Non-blocking Execution: The worker processes tasks independently, so a slow subscriber won't affect the ingestion of new webhooks.

Graceful Failures: If a delivery fails (e.g., 404 or 500 error), the system captures the exact error message and updates the job status without crashing.

Security: Ingestion and Stats endpoints are protected via API Key validation.

Developed by: Yara Afaneh
```
