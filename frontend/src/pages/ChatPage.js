/**
 * Chat Page — ChatGPT-style interface with IBM Granite
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MdSend, MdDelete, MdContentCopy, MdCheck } from "react-icons/md";
import { sendMessage, getChatHistory, clearChat, getSuggestions } from "../services/api";
import { useAuth } from "../context/AuthContext";

const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">AI</div>
    <div className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 rounded-2xl rounded-bl-none px-5 py-4">
      <div className="flex items-center gap-1">
        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
      </div>
    </div>
  </div>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors">
      {copied ? <MdCheck size={16} className="text-green-500" /> : <MdContentCopy size={16} />}
    </button>
  );
};

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Load history & suggestions on mount
  useEffect(() => {
    Promise.all([getChatHistory(), getSuggestions()])
      .then(([histRes, sugRes]) => {
        setMessages(histRes.data.messages || []);
        setSuggestions(sugRes.data.questions || []);
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg, id: Date.now() }]);
    setLoading(true);
    try {
      const res = await sendMessage(msg);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply, id: res.data.message_id }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Sorry, I couldn't connect to the AI. Please try again.", id: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all chat history?")) return;
    await clearChat();
    setMessages([]);
  };

  // Markdown components
  const mdComponents = {
    code({ node, inline, className, children, ...props }) {
      const lang = /language-(\w+)/.exec(className || "")?.[1];
      return inline ? (
        <code className="bg-gray-100 dark:bg-gray-800 text-ibm-blue px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...props}>{children}</code>
      ) : (
        <div className="relative my-3 rounded-xl overflow-hidden">
          <SyntaxHighlighter style={oneDark} language={lang || "text"} PreTag="div" {...props}>
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    },
    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-bold mt-3 mb-1.5">{children}</h2>,
    h3: ({ children }) => <h3 className="font-bold mt-2 mb-1">{children}</h3>,
    strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-ibm-blue pl-4 my-2 text-gray-600 dark:text-gray-400 italic">{children}</blockquote>
    ),
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center text-white font-black">AI</div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">LearnMate AI Coach</h1>
            <p className="text-xs text-ibm-teal font-medium">● Powered by IBM Granite</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <MdDelete size={18} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 pb-4 pr-1">
        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-ibm-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          /* Welcome state */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center mx-auto mb-5 text-white text-2xl font-black">AI</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Hello, {user?.name?.split(" ")[0]}! 👋</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              I'm your personal AI learning coach powered by IBM Granite. Ask me anything about your learning journey!
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-xl mx-auto">
              {suggestions.slice(0, 6).map((q, i) => (
                <button key={i} onClick={() => send(q)}
                  className="px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:border-ibm-blue hover:text-ibm-blue transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${msg.role === "user"
                  ? "bg-gradient-to-br from-ibm-purple to-ibm-teal text-white"
                  : "bg-gradient-to-br from-ibm-blue to-ibm-purple text-white"}`}
                >
                  {msg.role === "user" ? user?.name?.charAt(0).toUpperCase() : "AI"}
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] group relative ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed
                    ${msg.role === "user"
                      ? "bg-ibm-blue text-white rounded-br-none"
                      : "bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none"}`}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {/* Copy button for AI messages */}
                  {msg.role === "assistant" && (
                    <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton text={msg.content} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-700 p-3 mt-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your learning journey… (Enter to send, Shift+Enter for new line)"
          rows={2}
          className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400">Enter ↵ to send • Shift+Enter for new line</p>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="flex items-center gap-2 px-5 py-2 bg-ibm-blue text-white rounded-xl text-sm font-semibold hover:bg-ibm-hover transition-colors disabled:opacity-40 shadow-lg shadow-ibm-blue/30"
          >
            Send <MdSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
