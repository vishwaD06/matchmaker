"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./ChatInterface.module.css";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ProgressBar from "./ProgressBar";
import { streamChat, generateProfile, PHASE_SUGGESTIONS } from "@/lib/api";

const PHASE_TITLES = {
  intro: "1 of 5 · Identity & Intentions",
  values: "2 of 5 · Core Life Values",
  lifestyle: "3 of 5 · Daily Rhythm & Energy",
  relationships: "4 of 5 · Communication & Connection",
  communication: "5 of 5 · Chemistry & Non-Negotiables",
  wrapup: "Synthesizing Compatibility Profile"
};

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState("intro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [synthesisState, setSynthesisState] = useState(false);
  const [synthesisStep, setSynthesisStep] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Welcome to Matchmaker. I'm your AI matchmaker, and I'm here to understand who you truly are — beyond photos and algorithms.\n\nLet's start with the basics: what's your name, and what kind of connection are you looking to build here?"
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isProcessing, synthesisState]);

  // Focus input when ready
  useEffect(() => {
    if (!isProcessing && !synthesisState) {
      inputRef.current?.focus();
    }
  }, [isProcessing, synthesisState]);

  const submitMessage = async (textToSend) => {
    if (!textToSend.trim() || isProcessing) return;

    const userMessage = { role: "user", content: textToSend.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsProcessing(true);
    setStreamingContent("");

    try {
      let currentPhase = phase;
      let fullContent = "";

      for await (const chunk of streamChat(newMessages, phase)) {
        if (chunk.type === "token") {
          fullContent += chunk.content;
          setStreamingContent(fullContent);
        } else if (chunk.type === "phase") {
          currentPhase = chunk.phase;
          setPhase(currentPhase);
        } else if (chunk.type === "interview_complete") {
          handleInterviewComplete(newMessages, fullContent);
          return;
        } else if (chunk.type === "error") {
          throw new Error(chunk.content);
        }
      }

      setMessages([...newMessages, { role: "assistant", content: fullContent }]);
      setStreamingContent("");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm sorry, I hit a hiccup. Could you share that one more time?" }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessage(input);
  };

  const handleSuggestionClick = (suggestion) => {
    if (isProcessing) return;
    submitMessage(suggestion);
  };

  const handleInterviewComplete = async (conversationMessages, finalAssistantContent) => {
    const finalMessages = [
      ...conversationMessages,
      { role: "assistant", content: finalAssistantContent }
    ];
    setMessages(finalMessages);
    setStreamingContent("");
    setPhase("wrapup");
    setSynthesisState(true);

    // Staggered synthesis animation steps
    setTimeout(() => setSynthesisStep(1), 600);
    setTimeout(() => setSynthesisStep(2), 1400);
    setTimeout(() => setSynthesisStep(3), 2200);

    try {
      const profile = await generateProfile(finalMessages);
      sessionStorage.setItem("matchmaker_profile", JSON.stringify(profile));

      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    } catch (error) {
      console.error("Failed to generate profile:", error);
      setTimeout(() => {
        router.push("/profile");
      }, 3000);
    }
  };

  const currentSuggestions = PHASE_SUGGESTIONS[phase] || [];

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.navBar}>
          <Link href="/" className={styles.brandLink}>
            MATCHMAKER
          </Link>
          <div className={styles.stageBadge}>
            <span className={styles.stageDot}></span>
            <span>{PHASE_TITLES[phase] || "Discovery"}</span>
          </div>
        </div>
        <ProgressBar currentPhase={phase} />
      </header>

      {/* Messages */}
      <div className={styles.messageList}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} />
        ))}

        {streamingContent && (
          <ChatMessage
            message={{ role: "assistant", content: streamingContent }}
            isStreaming={true}
          />
        )}

        {isProcessing && !streamingContent && !synthesisState && (
          <TypingIndicator />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Suggestions */}
      {!isProcessing && !synthesisState && currentSuggestions.length > 0 && (
        <div className={styles.suggestionsArea}>
          <div className={styles.suggestionsTitle}>Quick Suggestions:</div>
          {currentSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.chip}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isProcessing ? "Analyzing your answer..." : "Type your response or select a suggestion above..."
          }
          disabled={isProcessing || synthesisState}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={!input.trim() || isProcessing || synthesisState}
          className={styles.sendButton}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12L2.01 3L2 10l15 2-15 2z" fill="currentColor" />
          </svg>
        </button>
      </form>

      {/* Synthesis Modal */}
      {synthesisState && (
        <div className={styles.synthesisModal}>
          <div className={styles.synthesisCard}>
            <div className={styles.synthesisSpinner} />
            <h2 className={styles.synthesisTitle}>Synthesizing Profile</h2>
            <p className={styles.synthesisSubtitle}>
              Our AI is distilling your answers into your compatibility blueprint.
            </p>

            <ul className={styles.synthesisSteps}>
              <li className={synthesisStep >= 0 ? styles.synthesisStepActive : ""}>
                {synthesisStep >= 1 ? "✓" : "○"} Analyzing core values & relationship intention
              </li>
              <li className={synthesisStep >= 1 ? styles.synthesisStepActive : ""}>
                {synthesisStep >= 2 ? "✓" : "○"} Calibrating Big 5 personality radar matrix
              </li>
              <li className={synthesisStep >= 2 ? styles.synthesisStepActive : ""}>
                {synthesisStep >= 3 ? "✓" : "○"} Finalizing compatibility dossier & matching vector
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
