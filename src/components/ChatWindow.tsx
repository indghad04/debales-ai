"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import IntegrationToggle from "./IntegrationToggle";

interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  steps?: string[];
  createdAt: string;
}

interface Conversation {
  _id: string;
  title: string;
  integrations: { shopify: boolean; crm: boolean };
}

export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch conversation and messages
  const { data, isLoading } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const res = await axios.get(`/api/conversations/${conversationId}`);
      return res.data as { conversation: Conversation; messages: Message[] };
    },
  });

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data?.messages]);

  // Toggle integration
  const toggleMutation = useMutation({
    mutationFn: async (key: "shopify" | "crm") => {
      const current = data?.conversation.integrations || { shopify: false, crm: false };
      const updated = { ...current, [key]: !current[key] };
      await axios.patch(`/api/conversations/${conversationId}`, {
        integrations: updated,
      });
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
    },
  });

  // Send message
  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await axios.post("/api/chat", {
        conversationId,
        message,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMutation.isPending) return;
    const message = input.trim();
    setInput("");
    sendMutation.mutate(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Integration toggles */}
      {data?.conversation && (
        <IntegrationToggle
          integrations={data.conversation.integrations}
          onToggle={(key) => toggleMutation.mutate(key)}
          disabled={toggleMutation.isPending}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {data?.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              AI Sales Assistant
            </h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Ask me anything about your sales, customers, or products.
              Toggle integrations above to give me access to your data!
            </p>
          </div>
        ) : (
          <>
            {data?.messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
            {sendMutation.isPending && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {sendMutation.isError && (
          <p className="text-red-500 text-xs mb-2">
            Failed to send message. Please try again.
          </p>
        )}
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sendMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-4 py-3 rounded-xl transition-colors text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}