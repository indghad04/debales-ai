import { IUser } from "../models/User";

// Pure functions — no database calls here
// Just rules based on user data

export function isAdmin(user: IUser): boolean {
  return user.role === "admin";
}

export function isMember(user: IUser): boolean {
  return user.role === "member" || user.role === "admin";
}

export function belongsToProject(
  user: IUser,
  projectId: string
): boolean {
  return user.projectId.toString() === projectId;
}

export function canAccessDashboard(user: IUser): boolean {
  return isAdmin(user);
}

export function canViewConversations(user: IUser): boolean {
  return isMember(user);
}

export function canCreateConversation(user: IUser): boolean {
  return isMember(user);
}