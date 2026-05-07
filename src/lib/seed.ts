import { connectDB } from "./db";
import Project from "../models/Project";
import User from "../models/User";
import DashboardConfig from "../models/DashboardConfig";

async function seed() {
  await connectDB();
  console.log("🌱 Seeding database...");

  // Clear existing data
  await Project.deleteMany({});
  await User.deleteMany({});
  await DashboardConfig.deleteMany({});

  // Create project
  const project = await Project.create({
    name: "Debales AI",
    slug: "debales-ai",
    description: "AI Sales Assistant Platform",
  });
  console.log("✅ Project created:", project.name);

  // Create admin user
  const admin = await User.create({
    name: "Indraja Ghadge",
    email: "admin@debales.ai",
    role: "admin",
    projectId: project._id,
  });
  console.log("✅ Admin created:", admin.email);

  // Create member user
  const member = await User.create({
    name: "John Member",
    email: "member@debales.ai",
    role: "member",
    projectId: project._id,
  });
  console.log("✅ Member created:", member.email);

  // Create dashboard config
  const dashboard = await DashboardConfig.create({
    projectId: project._id,
    title: "Debales AI Dashboard",
    sections: [
      {
        id: "overview",
        title: "Overview",
        order: 0,
        widgets: [
          {
            id: "total-users",
            type: "stat",
            title: "Total Users",
            value: "1,234",
            description: "Active users this month",
            order: 0,
            visible: true,
          },
          {
            id: "total-conversations",
            type: "stat",
            title: "Total Conversations",
            value: "5,678",
            description: "Conversations this month",
            order: 1,
            visible: true,
          },
          {
            id: "revenue",
            type: "stat",
            title: "Revenue",
            value: "$12,345",
            description: "Revenue this month",
            order: 2,
            visible: true,
          },
        ],
      },
      {
        id: "analytics",
        title: "Analytics",
        order: 1,
        widgets: [
          {
            id: "chat-volume",
            type: "chart",
            title: "Chat Volume",
            description: "Daily chat volume trend",
            order: 0,
            visible: true,
          },
          {
            id: "system-alert",
            type: "alert",
            title: "System Status",
            value: "All systems operational",
            description: "Last checked 5 mins ago",
            order: 1,
            visible: true,
          },
        ],
      },
    ],
  });
  console.log("✅ Dashboard config created!");

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin:", admin.email);
  console.log("📧 Member:", member.email);
  console.log("🏢 Project slug:", project.slug);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});