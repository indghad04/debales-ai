import { connectDB } from "../lib/db";
import Project, { IProject } from "../models/Project";

// Get project by slug
export async function getProjectBySlug(slug: string): Promise<IProject | null> {
  await connectDB();
  return Project.findOne({ slug });
}

// Get project by ID
export async function getProjectById(id: string): Promise<IProject | null> {
  await connectDB();
  return Project.findById(id);
}

// Get all projects
export async function getAllProjects(): Promise<IProject[]> {
  await connectDB();
  return Project.find({});
}