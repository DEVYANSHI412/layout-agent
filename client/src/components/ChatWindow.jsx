import { useEffect, useRef } from "react";

function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: 1, overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            background: msg.role === "user" ? "#1a1a2e" : "#f0f0f0",
            color: msg.role === "user" ? "white" : "black",
            padding: "10px 14px",
            borderRadius: "12px",
            maxWidth: "80%",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          {msg.content}
        </div>
      ))}
      {loading && (
        <div style={{ alignSelf: "flex-start", background: "#f0f0f0", padding: "10px 14px", borderRadius: "12px", fontSize: "14px" }}>
          ⏳ Soch raha hun...
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;