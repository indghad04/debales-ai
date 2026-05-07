interface Message {
  _id: string;
  role: "user" | "assistant";
  content: string;
  steps?: string[];
  createdAt: string;
}

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? "order-2" : "order-1"}`}>
        
        {/* AI steps */}
        {!isUser && message.steps && message.steps.length > 0 && (
          <div className="mb-2 space-y-1">
            {message.steps.map((step, i) => (
              <div
                key={i}
                className="text-xs text-gray-500 flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                {step}
              </div>
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <p className={`text-xs text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isUser
            ? "bg-blue-600 text-white ml-2 order-3"
            : "bg-gray-300 text-gray-600 mr-2 order-0"
        }`}
      >
        {isUser ? "U" : "AI"}
      </div>
    </div>
  );
}