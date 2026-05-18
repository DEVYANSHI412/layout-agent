import { useState } from "react";
import initialLayout from "./data/initialLayout.json";
import ChatWindow from "./components/ChatWindow";
import Preview from "./components/Preview";

function App() {
  const [layout, setLayout] = useState(initialLayout);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste! Main tumhara layout agent hun. Mujhse kaho jaise: 'Convert to 9:16', 'Move headline to top', 'Make headline smaller' 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          layout: layout,
          history: messages.slice(-6),
        }),
      });

      const data = await response.json();

      if (data.updatedLayout) {
        setLayout(data.updatedLayout);
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.assistantMessage },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Kuch error aaya: " + data.error },
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Server se connect nahi ho paya!" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* Left - Chat */}
      <div style={{ width: "35%", borderRight: "1px solid #ccc", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px", background: "#1a1a2e", color: "white", fontSize: "18px", fontWeight: "bold" }}>
          🎨 Layout Agent
        </div>
        <ChatWindow messages={messages} loading={loading} />
        <div style={{ padding: "12px", borderTop: "1px solid #ccc", display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Kuch likho jaise: Move headline to top..."
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{ padding: "10px 16px", background: loading ? "#ccc" : "#1a1a2e", color: "white", border: "none", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* Right - Preview + JSON */}
      <div style={{ width: "65%", display: "flex", flexDirection: "column" }}>
        <Preview layout={layout} />
        <div style={{ flex: 1, overflow: "auto", padding: "12px", background: "#1e1e1e" }}>
          <pre style={{ color: "#4ec9b0", fontSize: "11px", margin: 0 }}>
            {JSON.stringify(layout, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;