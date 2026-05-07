import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  title: string;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  productType: string;
  integrations: {
    shopify: boolean;
    crm: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    title: {
      type: String,
      default: "New Conversation",
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productType: {
      type: String,
      default: "AI Sales Assistant",
    },
    integrations: {
      shopify: { type: Boolean, default: false },
      crm: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);