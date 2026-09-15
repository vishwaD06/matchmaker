"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ChatInterface.module.css";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ProgressBar from "./ProgressBar";
import { streamChat, generateProfile } from "@/lib/api";

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState("intro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef(null);
  
  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi there! I'm so glad you're here. Let's start with the basics — what's your name, and what brings you to Matchmaker today?"
        }
      ]);
    }
  }, [messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isProcessing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsProcessing(true);
    setStreamingContent("");

    try {
      let currentPhase = phase;
      let fullContent = "";

      // Stream the response
      for await (const chunk of streamChat(newMessages, phase)) {
        if (chunk.type === "token") {
          fullContent += chunk.content;
          setStreamingContent(fullContent);
        } else if (chunk.type === "phase") {
          currentPhase = chunk.phase;
          setPhase(currentPhase);
        } else if (chunk.type === "interview_complete") {
          // Interview is done, proceed to profile generation
          handleInterviewComplete(newMessages, fullContent);
          return;
        } else if (chunk.type === "error") {
          throw new Error(chunk.content);
        }
      }

      // Done streaming this message
      setMessages([...newMessages, { role: "assistant", content: fullContent }]);
      setStreamingContent("");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "I'm sorry, I encountered an error. Could you try that again?" }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInterviewComplete = async (conversationMessages, finalAssistantContent) => {
    const finalMessages = [...conversationMessages, { role: "assistant", content: finalAssistantContent }];
    setMessages(finalMessages);
    setStreamingContent("");
    setPhase("wrapup");
    
    // Create a system message to show we're building the profile
    setIsProcessing(true);
    
    try {
      const profile = await generateProfile(finalMessages);
      // Store profile in sessionStorage to pass to the profile page
      sessionStorage.setItem("matchmaker_profile", JSON.stringify(profile));
      router.push("/profile");
    } catch (error) {
      console.error("Failed to generate profile:", error);
      setMessages([
        ...finalMessages,
        { role: "assistant", content: "I finished the interview, but hit a snag generating your profile. We'll fix this!" }
      ]);
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <ProgressBar currentPhase={phase} />
      </div>
      
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
        
        {isProcessing && !streamingContent && phase !== "wrapup" && (
          <TypingIndicator />
        )}
        
        {isProcessing && phase === "wrapup" && (
          <div className={styles.systemMessage}>
            <div className={styles.spinner}></div>
            Generating your compatibility profile...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isProcessing ? "Wait for AI..." : "Type your message..."}
          disabled={isProcessing}
          className={styles.input}
          autoFocus
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isProcessing}
          className={styles.sendButton}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12L2.01 3L2 10l15 2-15 2z" fill="currentColor" />
          </svg>
        </button>
      </form>
    </div>
  );
}
