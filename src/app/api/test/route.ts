import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { setUserCookie } from "@/lib/session";

export async function GET() {
  try {
    await connectDB();
    
    // Auto login as admin for testing
    const admin = await User.findOne({ email: "admin@debales.ai" });
    if (admin) {
      await setUserCookie(admin._id.toString());
    }

    const users = await User.find({});
    return NextResponse.json({ 
      message: "Logged in as admin!",
      userCount: users.length,
      users: users.map(u => ({ 
        name: u.name, 
        email: u.email, 
        role: u.role 
      }))
    });
  } catch (error) {
    return NextResponse.json({ 
      error: String(error)
    }, { status: 500 });
  }
}