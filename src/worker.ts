import { db } from "./db/db.js";
import { jobs } from "./db/schema.js";
import { eq } from "drizzle-orm";

export const processJobs = async () => {
  console.log("🔍 Checking for pending jobs...");

  const pendingJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.status, "pending"));

  if (pendingJobs.length === 0) {
    console.log("😴 No jobs to process.");
    return;
  }

  for (const job of pendingJobs) {
    try {
      console.log(`⏳ Processing Job ID: ${job.id}...`);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`✅ Job ${job.id} processed successfully!`);

      await db
        .update(jobs)
        .set({ status: "completed" })
        .where(eq(jobs.id, job.id));
    } catch (error) {
      console.error(`❌ Failed to process job ${job.id}:`, error);
      await db
        .update(jobs)
        .set({ status: "failed" })
        .where(eq(jobs.id, job.id));
    }
  }
};
