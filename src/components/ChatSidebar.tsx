"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Conversation {
  _id: string;
  title: string;
  createdAt: string;
}

export default function ChatSidebar({
  activeId,
}: {
  activeId?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch conversations
  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await axios.get("/api/conversations");
      return res.data.conversations as Conversation[];
    },
  });

  // Create new conversation
  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/conversations", {
        title: "New Conversation",
      });
      return res.data.conversation;
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.push(`/chat/${conversation._id}`);
    },
  });

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">Debales AI</h1>
        <p className="text-xs text-gray-400">AI Sales Assistant</p>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <button
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {createMutation.isPending ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <span>+</span>
          )}
          New Chat
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="text-center text-gray-400 text-sm mt-4">
            Loading...
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-4">
            No conversations yet
          </div>
        ) : (
          data?.map((conv) => (
            <button
              key={conv._id}
              onClick={() => router.push(`/chat/${conv._id}`)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors ${
                activeId === conv._id
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <p className="truncate">{conv.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(conv.createdAt).toLocaleDateString()}
              </p>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700">
        <button
          onClick={() => router.push("/admin")}
          className="w-full text-left text-xs text-gray-400 hover:text-white transition-colors px-2 py-1"
        >
          ⚙️ Admin Dashboard
        </button>
      </div>
    </div>
  );
}