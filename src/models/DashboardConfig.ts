import mongoose, { Schema, Document } from "mongoose";

export interface IWidget {
  id: string;
  type: "stat" | "chart" | "table" | "alert";
  title: string;
  value?: string;
  description?: string;
  order: number;
  visible: boolean;
}

export interface IDashboardConfig extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  sections: {
    id: string;
    title: string;
    order: number;
    widgets: IWidget[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const WidgetSchema = new Schema<IWidget>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["stat", "chart", "table", "alert"],
    required: true,
  },
  title: { type: String, required: true },
  value: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
});

const DashboardConfigSchema = new Schema<IDashboardConfig>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      default: "Admin Dashboard",
    },
    sections: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        order: { type: Number, default: 0 },
        widgets: [WidgetSchema],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.DashboardConfig ||
  mongoose.model<IDashboardConfig>("DashboardConfig", DashboardConfigSchema);