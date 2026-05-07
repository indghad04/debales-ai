import { connectDB } from "../lib/db";
import DashboardConfig, { IDashboardConfig } from "../models/DashboardConfig";

// Get dashboard config for a project
export async function getDashboardConfig(
  projectId: string
): Promise<IDashboardConfig | null> {
  await connectDB();
  return DashboardConfig.findOne({ projectId });
}

// Update dashboard config
export async function updateDashboardConfig(
  projectId: string,
  updates: Partial<IDashboardConfig>
): Promise<IDashboardConfig | null> {
  await connectDB();
  return DashboardConfig.findOneAndUpdate(
    { projectId },
    updates,
    { new: true }
  );
}