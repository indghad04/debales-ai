import { connectDB } from "../lib/db";
import Conversation, { IConversation } from "../models/Conversation";
import Message, { IMessage } from "../models/Message";
import mongoose from "mongoose";

// Create new conversation
export async function createConversation(
  projectId: string,
  userId: string,
  title: string = "New Conversation"
): Promise<IConversation> {
  await connectDB();
  return Conversation.create({
    title,
    projectId: new mongoose.Types.ObjectId(projectId),
    userId: new mongoose.Types.ObjectId(userId),
    productType: "AI Sales Assistant",
    integrations: { shopify: false, crm: false },
  });
}

// Get all conversations for a project
export async function getConversationsByProject(
  projectId: string
): Promise<IConversation[]> {
  await connectDB();
  return Conversation.find({ 
    projectId: new mongoose.Types.ObjectId(projectId) 
  }).sort({ createdAt: -1 });
}

// Get single conversation
export async function getConversationById(
  id: string
): Promise<IConversation | null> {
  await connectDB();
  return Conversation.findById(id);
}

// Update integration toggles
export async function updateIntegrations(
  conversationId: string,
  integrations: { shopify: boolean; crm: boolean }
): Promise<IConversation | null> {
  await connectDB();
  return Conversation.findByIdAndUpdate(
    conversationId,
    { integrations },
    { new: true }
  );
}

// Add message to conversation
export async function addMessage(
  conversationId: string,
  projectId: string,
  role: "user" | "assistant",
  content: string,
  steps: string[] = []
): Promise<IMessage> {
  await connectDB();
  return Message.create({
    conversationId: new mongoose.Types.ObjectId(conversationId),
    projectId: new mongoose.Types.ObjectId(projectId),
    role,
    content,
    steps,
  });
}

// Get messages for a conversation
export async function getMessagesByConversation(
  conversationId: string
): Promise<IMessage[]> {
  await connectDB();
  return Message.find({ 
    conversationId: new mongoose.Types.ObjectId(conversationId) 
  }).sort({ createdAt: 1 });
}