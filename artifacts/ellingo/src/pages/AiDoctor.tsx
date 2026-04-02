import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Stethoscope, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "What is ATP and how is it produced?",
  "Explain the cardiovascular system",
  "What are beta-lactam antibiotics?",
  "Mnemonic for cranial nerves",
  "What is a normal blood pressure?",
  "Explain the Krebs cycle",
];

export default function AiDoctor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am **Dr. Denisa** 👩‍⚕️\n\nI am your AI medical assistant. You can ask me about:\n- 🦴 Anatomy and physiology\n- 💊 Pharmacology and medications\n- 🔬 Biology and biochemistry\n- 📚 USMLE questions\n- 🧠 Neuroanatomy\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const response = await fetch("/api/ai-doctor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: newHistory.slice(-8).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: updated[updated.length - 1].content + data.content,
                  };
                  return updated;
                });
              }
              if (data.done) break;
            } catch {}
          }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content: "❌ Connection error. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! How can I help you? 😊",
    }]);
  };

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, "• $1")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-violet-600 flex items-center justify-center shadow-lg">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Fredoka One, sans-serif' }}>
              Dr. Denisa <Sparkles className="w-5 h-5 inline text-yellow-500" />
            </h1>
            <p className="text-sm text-muted-foreground font-semibold">AI Medical Assistant • Active</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground gap-1">
          <Trash2 className="w-4 h-4" /> Clear
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
              msg.role === "assistant"
                ? "bg-gradient-to-br from-pink-400 to-violet-600"
                : "bg-primary"
            }`}>
              {msg.role === "assistant"
                ? <Bot className="w-4 h-4 text-white" />
                : <User className="w-4 h-4 text-white" />
              }
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.role === "assistant"
                ? "bg-card border rounded-tl-sm"
                : "bg-primary text-primary-foreground rounded-tr-sm"
            }`}>
              {msg.content === "" && isLoading ? (
                <div className="flex gap-1 py-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <p
                  className="text-sm font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div className="mb-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-xs bg-muted hover:bg-primary/10 hover:text-primary border rounded-full px-3 py-1.5 font-semibold transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Dr. Denisa a medical question... (Enter to send)"
          rows={2}
          className="flex-1 resize-none rounded-2xl border-2 border-border focus:border-primary/60 bg-card px-4 py-3 text-sm font-medium outline-none transition-colors min-h-[52px] max-h-32"
          disabled={isLoading}
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="h-[52px] w-[52px] rounded-2xl p-0 flex-shrink-0 bg-gradient-to-br from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 shadow-lg"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-2 font-medium">
        ⚕️ Dr. Denisa is AI. Consult a real doctor for diagnosis.
      </p>
    </div>
  );
}
