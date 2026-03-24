import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MessageRole = "bot" | "user";

interface ChatOption {
  label: string;
  value: string;
}

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  options?: ChatOption[];
}

const defaultMenuOptions: ChatOption[] = [
  { label: "Courses & Classes", value: "topic:courses" },
  { label: "Admission Process", value: "topic:admission" },
  { label: "Fees", value: "topic:fees" },
  { label: "Contact & Location", value: "topic:contact" },
  { label: "Class Timings", value: "topic:timings" },
  { label: "Exit Chat", value: "action:exit" },
];

const solveOptions: ChatOption[] = [
  { label: "Yes, solved", value: "solved:yes" },
  { label: "No, need help", value: "solved:no" },
];

const menuAfterSolveOptions: ChatOption[] = [
  { label: "Ask Another Question", value: "action:menu" },
  { label: "Exit Chat", value: "action:exit" },
];

const notSolvedOptions: ChatOption[] = [
  { label: "Show Contact Details", value: "topic:contact" },
  { label: "Ask Another Question", value: "action:menu" },
  { label: "Exit Chat", value: "action:exit" },
];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const buildInitialMessages = (): ChatMessage[] => [
  {
    id: createId(),
    role: "bot",
    text: "Welcome to APS Assistant. How can I help you today? Choose an option below or type your question.",
    options: defaultMenuOptions,
  },
];

const getAnswerFromIntent = (query: string) => {
  const q = query.toLowerCase();

  if (q.includes("admission") || q.includes("enroll") || q.includes("apply")) {
    return "Admission process: 1) Visit or call the institute, 2) Share student class details, 3) Counseling and stream selection, 4) Complete form + fee confirmation, 5) Start classes. You can also use the Admission page for details.";
  }

  if (q.includes("course") || q.includes("class") || q.includes("subject") || q.includes("coaching")) {
    return "APS provides coaching from Nursery to 12th. Focus areas include board exam preparation, concept clarity, test practice, and student progress tracking.";
  }

  if (q.includes("fee") || q.includes("fees") || q.includes("cost") || q.includes("charge")) {
    return "Fee depends on class and program. For exact fee details, please contact the institute directly using the phone numbers in the Contact section for the latest structure.";
  }

  if (q.includes("time") || q.includes("timing") || q.includes("schedule") || q.includes("batch")) {
    return "Class timings vary by class and batch. Morning and evening slots may be available. Contact APS to get the active batch timing for your class.";
  }

  if (q.includes("contact") || q.includes("phone") || q.includes("mobile") || q.includes("address") || q.includes("location")) {
    return "Contact details: Near Taj Hospital, Jagdishpur, West Champaran, Bihar - 845459. Call: 7903627361 or 9798302129.";
  }

  if (q.includes("result") || q.includes("marks") || q.includes("grade")) {
    return "Student results are published in the Results section. You can check class, year, percentage, and grade details there.";
  }

  if (q.includes("notice") || q.includes("announcement") || q.includes("update")) {
    return "Latest notices are available in the notice bar and notice sections. Keep checking the homepage for current announcements.";
  }

  return "I can help with courses, admission, fees, timings, notices, results, and contact details. Please ask your question in simple words.";
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => buildInitialMessages());

  const listRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);

  const canSend = useMemo(() => inputText.trim().length > 0 && !chatEnded && !isTyping, [inputText, chatEnded, isTyping]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const pushUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "user",
        text,
      },
    ]);
  };

  const pushBotMessage = (text: string, options?: ChatOption[]) => {
    setIsTyping(true);

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "bot",
          text,
          options,
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  const resetChatSession = () => {
    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);
    setChatEnded(false);
    setInputText("");
    setMessages(buildInitialMessages());
  };

  const closeAndResetChat = () => {
    setIsOpen(false);
    resetChatSession();
  };

  const handleExitChat = () => {
    closeAndResetChat();
  };

  const showMainMenu = () => {
    pushBotMessage("Sure. Choose what you want help with:", defaultMenuOptions);
  };

  const handleIntent = (query: string) => {
    const answer = getAnswerFromIntent(query);
    pushBotMessage(`${answer} Did this solve your problem?`, solveOptions);
  };

  const handleOptionClick = (option: ChatOption) => {
    pushUserMessage(option.label);

    if (option.value === "action:exit") {
      handleExitChat();
      return;
    }

    if (option.value === "action:menu") {
      showMainMenu();
      return;
    }

    if (option.value === "action:restart") {
      resetChatSession();
      return;
    }

    if (option.value === "solved:yes") {
      pushBotMessage("Great. Happy to help. Do you want to ask anything else?", menuAfterSolveOptions);
      return;
    }

    if (option.value === "solved:no") {
      pushBotMessage("No problem. I can guide further or share direct contact details.", notSolvedOptions);
      return;
    }

    if (option.value.startsWith("topic:")) {
      const topic = option.value.split(":")[1] || "";
      handleIntent(topic);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;

    const text = inputText.trim();
    setInputText("");
    pushUserMessage(text);
    handleIntent(text);
  };

  const handleLauncherClick = () => {
    if (isOpen) {
      closeAndResetChat();
      return;
    }
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[120]">
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] max-w-sm h-[min(32rem,calc(100dvh-6.5rem))] sm:h-[min(34rem,calc(100dvh-8rem))] mb-2 sm:mb-3 rounded-2xl border border-secondary/30 bg-white shadow-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-r from-primary to-[#1f4f8a] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold leading-none">APS Chatbot</p>
                <p className="text-[11px] text-white/80 mt-1">Ask. Learn. Solve.</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white"
              onClick={closeAndResetChat}
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-white to-slate-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2.5 text-sm shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === "bot" ? (
                      <Bot className="w-4 h-4 mt-0.5 text-secondary shrink-0" />
                    ) : (
                      <User className="w-4 h-4 mt-0.5 text-white/90 shrink-0" />
                    )}
                    <p className="leading-relaxed">{message.text}</p>
                  </div>

                  {message.options && message.options.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {message.options.map((opt) => (
                        <button
                          key={opt.value + opt.label}
                          type="button"
                          className="rounded-full border border-secondary/35 bg-secondary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-secondary/20 transition-colors"
                          onClick={() => handleOptionClick(opt)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-white border border-slate-200 px-3 py-2.5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Bot className="w-4 h-4 text-secondary" />
                    <span className="chat-typing-dots">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="p-3 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={chatEnded ? "Chat ended. Restart to continue" : "Type your question..."}
                disabled={chatEnded || isTyping}
                className="h-10"
              />
              <Button type="submit" size="icon" disabled={!canSend}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={handleLauncherClick}
        aria-label={isOpen ? "Hide chatbot" : "Open chatbot"}
        className="chatbot-fab-shine relative h-14 w-14 sm:h-16 sm:w-16 rounded-full border border-white/50 text-white shadow-[0_10px_28px_rgba(0,0,0,0.33)] flex items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1f88ff] via-[#2575fc] to-[#00d4ff]" />
        <span className="absolute inset-0 rounded-full opacity-65 chatbot-fab-pulse" />
        <span className="relative z-10 flex items-center justify-center">
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </span>
        {!isOpen && <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-200 z-10" />}
      </button>
    </div>
  );
};

export default ChatbotWidget;
