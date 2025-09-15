import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Send, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import { addMessage } from "@/redux/slices/chat/chat.slice";
import {
  useCreateConversationMutation,
  useSendMessageMutation,
} from "@/redux/slices/chat/chat.api";
import { suggestedQuestions } from "../../lib/suggested_questions"; // Adjust path if needed

const rotatingPlaceholders = [
  "Ask IRIS: Reliance Industries fundamentals 📊",
  "What is the Technical performance of Tata Motors like? 📈",
  "Explain RSI and its calculations 🤔",
  "Stock valuation of Apple 🍏",
  "Is this a bull or bear trend? 🐂🐻",
];

const ChatInputForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [createConversation] = useCreateConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State for UI enhancements
  const [inputText, setInputText] = useState("");
  const [isQuestionHubOpen, setIsQuestionHubOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Get loading state from Redux to control input
  const isLoading = useAppSelector((state: RootState) => state.chat.loading);

  // Effect for rotating placeholders
  useEffect(() => {
    if (isLoading || inputText) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading, inputText]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText.trim() === "" || isLoading) return;

    const prompt = inputText.trim();
    setInputText(""); // Clear input immediately for better UX

    let sessionId = id;
    if (!sessionId) {
      try {
        const newSession = await createConversation().unwrap();
        sessionId = newSession.chat_session_id;
        navigate(`/c/${sessionId}`, { replace: true });
      } catch (error) {
        console.error("Failed to create conversation:", error);
        return; // Stop if session creation fails
      }
    }

    dispatch(
      addMessage({
        id: nanoid(),
        role: "user",
        content: prompt,
        created_at: new Date().toISOString(),
      })
    );

    // This will now run with the correct sessionId
    sendMessage({ message: prompt, chat_session_id: sessionId });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4">
      <form
        onSubmit={handleFormSubmit}
        className="relative flex items-center rounded-2xl border bg-card shadow-md transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-400"
      >
        {/* Question Hub Popover */}
        <Popover open={isQuestionHubOpen} onOpenChange={setIsQuestionHubOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              title="Suggested Questions"
              className="p-3 text-text-secondary hover:text-cyan-400 transition-colors"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Lightbulb
                  size={20}
                  className="text-yellow-400 drop-shadow-md"
                />
              </motion.div>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[300px] sm:w-[400px] md:w-[500px] mb-2 p-3 rounded-xl border bg-card shadow-lg"
            side="top"
            align="start"
            sideOffset={8}
          >
            <div className="p-2">
              <h4 className="font-semibold text-text-primary">Question Hub</h4>
              <p className="text-sm text-text-secondary">
                Click any question to ask IRIS.
              </p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <Accordion type="single" collapsible className="w-full">
                {suggestedQuestions.map((categoryItem) => (
                  <AccordionItem
                    key={categoryItem.category}
                    value={categoryItem.category}
                  >
                    <AccordionTrigger className="text-sm font-medium text-text-primary hover:no-underline">
                      {categoryItem.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categoryItem.questions.map((q, index) => (
                          // RENDERED AS A DIV - NOT CLICKABLE YET
                          <div
                            key={index}
                            className="w-full text-left p-3 rounded-md hover:bg-accent/40 transition-colors cursor-pointer"
                          >
                            <p className="text-sm font-medium text-text-primary">
                              {q.question}
                            </p>
                            <p className="text-xs text-text-secondary mt-1">
                              {q.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </PopoverContent>
        </Popover>

        {/* Input with animated placeholder */}
        <div className="relative flex-grow px-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="w-full py-4 bg-transparent outline-none text-text-primary text-sm placeholder-transparent"
          />
          <AnimatePresence>
            {!inputText && !isLoading && (
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.7, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-text-secondary pointer-events-none"
              >
                {rotatingPlaceholders[placeholderIndex]}
              </motion.span>
            )}
            {isLoading && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-text-secondary pointer-events-none"
              >
                IRIS is analyzing the markets... ⚡
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Send button */}
        <Button
          type="submit"
          title="Send message"
          disabled={!inputText.trim() || isLoading}
          size="icon"
          className="m-1.5 flex-shrink-0"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

export default ChatInputForm;
