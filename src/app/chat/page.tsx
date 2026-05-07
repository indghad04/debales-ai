import ChatSidebar from "@/components/ChatSidebar";

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💬</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Welcome to Debales AI
          </h2>
          <p className="text-gray-400 text-sm">
            Select a conversation or create a new one to get started!
          </p>
        </div>
      </div>
    </div>
  );
}