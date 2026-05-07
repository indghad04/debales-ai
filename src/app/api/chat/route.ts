import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import "@/models/Project"; // needed for populate
import {
  getConversationById,
  addMessage,
  getMessagesByConversation,
} from "@/services/conversation.service";
import { generateAIResponse } from "@/services/ai.service";

const ChatSchema = z.object({
  conversationId: z.string(),
  message: z.string().min(1, "Message cannot be empty"),
});

async function getUserFromRequest(req: NextRequest) {
  const userId = req.cookies.get("userId")?.value;
  if (!userId) return null;
  await connectDB();
  return User.findById(userId); // ← no populate
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
  return NextResponse.json(
    { error: parsed.error.issues[0].message },
    { status: 400 }
  );
}
    const { conversationId, message } = parsed.data;

    const conversation = await getConversationById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    await addMessage(
      conversationId,
      user.projectId.toString(),
      "user",
      message
    );

    const previousMessages = await getMessagesByConversation(conversationId);
    const chatHistory = previousMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const { response, steps } = await generateAIResponse(
      chatHistory,
      conversation.integrations
    );

    const assistantMessage = await addMessage(
      conversationId,
      user.projectId.toString(),
      "assistant",
      response,
      steps
    );

    return NextResponse.json({
      message: assistantMessage,
      steps,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}