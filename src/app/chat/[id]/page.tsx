import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex h-screen bg-white">
      <ChatSidebar activeId={id} />
      <ChatWindow conversationId={id} />
    </div>
  );
}