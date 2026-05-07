import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import "@/models/Project";
import { canAccessDashboard } from "@/access/rules";
import { getDashboardConfig } from "@/services/dashboard.service";

async function getUserFromRequest(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  if (!userId) return null;
  await connectDB();
  return User.findById(userId);
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canAccessDashboard(user)) {
      return NextResponse.json(
        { error: "Forbidden - admin only" },
        { status: 403 }
      );
    }

    const config = await getDashboardConfig(user.projectId.toString());
    if (!config) {
      return NextResponse.json(
        { error: "Dashboard config not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ config });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}