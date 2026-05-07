import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import "@/models/Project"; // needed for populate
import {
  getConversationById,
  getMessagesByConversation,
  updateIntegrations,
} from "@/services/conversation.service";

const UpdateIntegrationsSchema = z.object({
  integrations: z.object({
    shopify: z.boolean(),
    crm: z.boolean(),
  }),
});

async function getUserFromRequest(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  if (!userId) return null;
  await connectDB();
  return User.findById(userId); // ← no populate
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const conversation = await getConversationById(id);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = await getMessagesByConversation(id);
    return NextResponse.json({ conversation, messages });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const parsed = UpdateIntegrationsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const conversation = await updateIntegrations(id, parsed.data.integrations);
    return NextResponse.json({ conversation });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}