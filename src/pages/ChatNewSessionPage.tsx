import { useEffect, useState, useRef } from "react";
import { Send, Paperclip, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import AnimatedOrb from "@/components/animated-orbit";

const recommendations = [
  {
    title: "Compare Two Stocks",
    question: "Compare the fundamentals of ICICI Bank and HDFC Bank",
  },
  {
    title: "Find Top Performers",
    question: "What are the top 5 companies by market capitalization?",
  },
  {
    title: "Get News Sentiment",
    question: "What is the recent news sentiment for Infosys?",
  },
  {
    title: "Shareholding patterns",
    question: "Shareholding patterns for Titan Company?",
  },
  { title: "Check Technicals", question: "Technical Analysis of Tata Motors?" },
  {
    title: "Get a Broad Outlook",
    question: "Is HDFC Bank a good buy right now?",
  },
];

const irisPlaceholders = [
  "📈 IRIS says: Bulls make money, bears make money… but pigs get slaughtered!",
  "💹 Ask IRIS: Need a stock tip? Don't panic, I'm not your broker 😉",
  "📊 IRIS knows: In trading, even your coffee costs more than your gains sometimes!",
  "💸 IRIS whispers: Buy low, sell high… easier said than done!",
];

const ChatNewSessionPage = () => {
  const [value, setValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTextarea, setIsTextarea] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Model selector state
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
  // const [selectedModel, setSelectedModel] = useState("IRIS v1");
  const modelSelectorRef = useRef<HTMLDivElement>(null);
  // const models = ["IRIS v1", "IRIS v0"];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(event.target as Node)
      ) {
        setIsModelSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const pastedText = e.clipboardData.getData("text");

    // If pasting multi-line content, switch to textarea
    if (pastedText.includes("\n") || pastedText.length > 100) {
      setIsTextarea(true);
    }
  };
  useEffect(() => {
    if (isTextarea && textareaRef.current) {
      textareaRef.current.focus();
    } else if (!isTextarea && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTextarea]);

  // Rotate placeholders every 3s when not typing
  useEffect(() => {
    if (isTyping) return;
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % irisPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    setIsTyping(value.length > 0);
  }, [value]);

  const handleSendMessage = (messageOrEvent?: string | React.FormEvent) => {
    let messageToSend = "";

    if (typeof messageOrEvent === "string") {
      messageToSend = messageOrEvent;
    } else {
      if (messageOrEvent) messageOrEvent.preventDefault();
      messageToSend = value.trim();
    }

    if (messageToSend && !isProcessing) {
      console.log("Sending message:", messageToSend);
      // Here you would typically call your actual message handler
      // onSendMessage(messageToSend);

      // Simulate processing
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 2000);

      if (typeof messageOrEvent !== "string") {
        setValue("");
      }
    }
  };

  const handleChipClick = (question: string) => {
    if (!isProcessing) {
      handleSendMessage(question);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-background h-full relative flex flex-col items-center justify-center rounded-xl border p-4">
      <div
        className="absolute rounded-xl z-0 inset-0 bg-[radial-gradient(125%_125%_at_50%_20%,transparent_40%,oklch(0.6772_0.22_216.4337_/_0.3)_70%,oklch(0.6772_0.3_216.4337)_100%)]
"
      />
      <div className="w-full backdrop-blur-lg z-10 max-w-2xl">
        <div className="mb-6 flex justify-center">
          <AnimatedOrb />
        </div>

        <h1 className="text-center text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Just talk to <span className="text-[#0dd3ff]">IRIS</span>
        </h1>

        <div className="mt-8 flex flex-col rounded-2xl bg-card p-4 shadow-sm relative border">
          {/* Floating Placeholder */}
          <AnimatePresence mode="wait">
            {!isTyping && (
              <motion.div
                key={currentPlaceholder}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute left-5 top-5 pointer-events-none text-muted-foreground text-base"
              >
                {irisPlaceholders[currentPlaceholder]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          {isTextarea ? (
            <textarea
              ref={textareaRef}
              value={value}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onChange={(e) => setValue(e.target.value)}
              className="w-full flex-grow resize-none bg-transparent p-2 text-base text-foreground focus:outline-none placeholder:text-muted-foreground"
              rows={3}
              disabled={isProcessing}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-transparent p-2 text-base text-foreground focus:outline-none placeholder:text-muted-foreground"
              disabled={isProcessing}
            />
          )}

          {/* Bottom Bar */}
          <div className=" flex items-center justify-between">
            {/* Model Selector */}
            <div className="relative" ref={modelSelectorRef}>
              {/* <button
                type="button"
                onClick={() => setIsModelSelectorOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <span>{selectedModel}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isModelSelectorOpen ? "rotate-180" : ""
                  }`}
                />
              </button> */}
              <AnimatePresence>
                {isModelSelectorOpen && (
                  <motion.div
                    className="absolute bottom-full left-0 z-20 mb-2 w-full min-w-max rounded-md border shadow-lg bg-popover"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    {/* {models.map((model) => (
                      <div
                        key={model}
                        onClick={() => {
                          setSelectedModel(model);
                          setIsModelSelectorOpen(false);
                        }}
                        className="cursor-pointer px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        {model}
                      </div>
                    ))} */}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {/* <button
                type="button"
                title="Attach file"
                className="h-9 w-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center"
              >
                <Paperclip className="h-5 w-5" />
              </button> */}
              <button
                type="submit"
                onClick={(e) => handleSendMessage(e)}
                title="Send message"
                disabled={!value.trim() || isProcessing}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground enabled:hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {recommendations.map((rec) => (
            <motion.button
              key={rec.title}
              onClick={() => handleChipClick(rec.question)}
              disabled={isProcessing}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-lg border bg-card p-3 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="font-medium text-foreground">{rec.title}</span>
              <p className="mt-1 line-clamp-2 text-xs">{rec.question}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatNewSessionPage;
