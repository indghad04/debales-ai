import { connectDB } from "../lib/db";
import User, { IUser } from "../models/User";

// Get user by email
export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  return User.findOne({ email }).populate("projectId");
}

// Get user by ID
export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB();
  return User.findById(id).populate("projectId");
}

// Get all users in a project
export async function getUsersByProject(projectId: string): Promise<IUser[]> {
  await connectDB();
  return User.find({ projectId });
}