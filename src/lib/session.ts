import { cookies } from "next/headers";
import { connectDB } from "./db";
import User, { IUser } from "../models/User";

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    console.log("Cookie userId:", userId);
    if (!userId) return null;
    await connectDB();
    const user = await User.findById(userId).populate("projectId");
    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function setUserCookie(userId: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("userId", userId, {
      httpOnly: true,
      path: "/",
      maxAge: 604800,
      secure: false,
      sameSite: "lax",
    });
    console.log("Cookie set for userId:", userId);
  } catch (error) {
    console.error("setUserCookie error:", error);
  }
}

export async function clearUserCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("userId");
  } catch (error) {
    console.error("clearUserCookie error:", error);
  }
}