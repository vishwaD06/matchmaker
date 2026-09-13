"use client";

import { useEffect, useRef } from "react";
import styles from "./ChatMessage.module.css";

export default function ChatMessage({ message, isStreaming = false }) {
  const isUser = message.role === "user";

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.user : styles.ai}`}>
      {!isUser && (
        <div className={styles.avatar}>
          AI
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
        {message.content}
        {isStreaming && <span className={styles.cursor}></span>}
      </div>
    </div>
  );
}
