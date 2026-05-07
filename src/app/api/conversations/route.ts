import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { canViewConversations } from "@/access/rules";
import "@/models/Project"; // needed for populate
import {
  createConversation,
  getConversationsByProject,
} from "@/services/conversation.service";

const CreateConversationSchema = z.object({
  title: z.string().optional(),
});

async function getUserFromRequest(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  if (!userId) return null;
  await connectDB();
  return User.findById(userId); // ← no populate
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canViewConversations(user)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const conversations = await getConversationsByProject(
      user.projectId.toString()
    );

    return NextResponse.json({ conversations });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateConversationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const conversation = await createConversation(
      user.projectId.toString(),
      user._id.toString(),
      parsed.data.title
    );

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}