"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import DashboardSection from "@/components/DashboardSection";

interface Widget {
  id: string;
  type: "stat" | "chart" | "table" | "alert";
  title: string;
  value?: string;
  description?: string;
  order: number;
  visible: boolean;
}

interface Section {
  id: string;
  title: string;
  order: number;
  widgets: Widget[];
}

interface DashboardConfig {
  title: string;
  sections: Section[];
}

export default function AdminPage() {
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axios.get("/api/dashboard");
      return res.data.config as DashboardConfig;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Access denied or not logged in!
          </p>
          <button
            onClick={() => router.push("/chat")}
            className="text-blue-500 underline text-sm"
          >
            Go to Chat
          </button>
        </div>
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = [...(data?.sections || [])].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {data?.title || "Admin Dashboard"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Layout driven by MongoDB config
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => router.push("/chat")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              💬 Go to Chat
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Config-driven dashboard:</span> This
            layout is loaded from MongoDB. Edit the{" "}
            <span className="font-mono bg-blue-100 px-1 rounded">
              dashboardconfigs
            </span>{" "}
            collection to change sections, widgets, and order without any code
            changes!
          </p>
        </div>

        {/* Sections from MongoDB config */}
        {sortedSections.map((section) => (
          <DashboardSection key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}