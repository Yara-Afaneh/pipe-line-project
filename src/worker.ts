import { db } from "./db/db.js";
import { jobs } from "./db/schema.js";
import { eq } from "drizzle-orm";

export const processJobs = async () => {
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
      const payload = job.data as any;

      console.log(
        `🚀 [Job ID: ${job.id.substring(0, 8)}] Processing started...`,
      );

      if (payload.type === "new_task") {
        console.log(
          `🏗️  TASK ACTION: Engineering team notified about: "${payload.description}"`,
        );
      } else if (payload.type === "notification") {
        console.log(
          `🔔 NOTIFICATION ACTION: Sending alert: "${payload.message}"`,
        );
      } else {
        console.log(
          `❓ UNKNOWN ACTION: Received type "${payload.type}", no specific logic defined.`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await db
        .update(jobs)
        .set({ status: "completed" })
        .where(eq(jobs.id, job.id));
      console.log(`✅ Job ${job.id.substring(0, 8)} is now COMPLETED.`);
    } catch (error) {
      console.error(`❌ Error processing job ${job.id}:`, error);
      await db
        .update(jobs)
        .set({ status: "failed" })
        .where(eq(jobs.id, job.id));
    }
  }
};
