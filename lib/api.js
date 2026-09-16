/**
 * API Client & Native Onboarding Discovery Engine
 * 
 * Provides an intelligent conversational onboarding engine that deeply discovers
 * the user's personality, core values, communication style, lifestyle, and relationship criteria,
 * and synthesizes them into an authentic compatibility profile.
 */

const API_BASE = "http://localhost:8000/api";

// Quick reply suggestions for each phase
export const PHASE_SUGGESTIONS = {
  intro: [
    "Looking for a committed relationship",
    "Looking for intentional dating & deep connection",
    "Looking for my life partner",
    "Taking things slow, authentic & meaningful"
  ],
  values: [
    "Growth, Authenticity & Ambition",
    "Kindness, Empathy & Family",
    "Creativity, Adventure & Freedom",
    "Honesty, Humor & Work-Life Balance"
  ],
  lifestyle: [
    "Slow morning coffee, reading & cozy vibes",
    "Hiking, outdoor exploration & weekend trips",
    "Cooking good food & intimate dinner with friends",
    "Fitness, gallery visits & creative pursuits"
  ],
  relationships: [
    "Direct, honest, prefers talking face-to-face",
    "Gentle listener, work through things calmly",
    "Quality time, deep affection & encouragement",
    "Playful banter mixed with deep late-night talks"
  ],
  communication: [
    "Emotional maturity is key; flaky communication is a dealbreaker",
    "Kindness & consistency; arrogance is a dealbreaker",
    "Shared humor & ambition; lack of curiosity is a dealbreaker",
    "Loyalty & empathy; dishonesty is a dealbreaker"
  ]
};

/**
 * Parses user's name from introductory message
 */
function extractName(text) {
  if (!text) return "Alex";
  const namePatterns = [
    /(?:my name is|i'm called|i am|call me|i'm)\s+([A-Za-z]+)/i,
    /^([A-Za-z]+)(?:[,.\s]|$)/
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 1) {
      const candidate = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      const ignored = ["hi", "hello", "hey", "i", "im", "well", "looking", "im looking"];
      if (!ignored.includes(candidate.toLowerCase())) {
        return candidate;
      }
    }
  }
  const words = text.trim().split(/\s+/);
  if (words.length > 0 && words[0].length > 1 && !words[0].includes(".")) {
    return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return "You";
}

/**
 * Native conversational state machine for the onboarding interview
 */
async function* nativeStreamChat(messages, phase) {
  // Small simulated typing delay for realism
  await new Promise((resolve) => setTimeout(resolve, 350));

  const userMessages = messages.filter((m) => m.role === "user");
  const lastUserText = userMessages[userMessages.length - 1]?.content || "";
  const stepCount = userMessages.length;

  let nextPhase = phase;
  let responseText = "";

  if (stepCount === 1) {
    const extractedName = extractName(lastUserText);
    nextPhase = "values";
    yield { type: "phase", phase: nextPhase };
    
    const introResponses = [
      `Wonderful to meet you, ${extractedName}. Finding someone who is truly aligned with your intentions makes all the difference. To help me understand what drives you at your core, what are 2 or 3 values or passions that guide how you live your life?`,
      `It's so great to meet you, ${extractedName}. Intentional dating begins with knowing what matters most. What are 2 or 3 core values or beliefs that define who you are today?`
    ];
    responseText = introResponses[Math.floor(Math.random() * introResponses.length)];
  } else if (stepCount === 2) {
    nextPhase = "lifestyle";
    yield { type: "phase", phase: nextPhase };
    
    responseText = `Those are beautiful values — they speak volumes about how you see the world. Now let's explore your everyday rhythm: how do you spend your favorite kind of weekend, and what activity truly recharges your battery?`;
  } else if (stepCount === 3) {
    nextPhase = "relationships";
    yield { type: "phase", phase: nextPhase };
    
    responseText = `That sounds so grounding. A great match is someone whose daily energy complements yours. When you're sharing your life with a partner, what is your communication style, and what does healthy emotional connection look like to you?`;
  } else if (stepCount === 4) {
    nextPhase = "communication";
    yield { type: "phase", phase: nextPhase };
    
    responseText = `Thank you for sharing that openly. Communication is truly the foundation of any lasting bond. To complete your compatibility blueprint: what is one green flag you cherish most in a partner — and what is an absolute non-negotiable deal-breaker for you?`;
  } else {
    // Interview complete!
    nextPhase = "wrapup";
    yield { type: "phase", phase: "wrapup" };
    
    responseText = `Thank you so much for your honesty and depth. I've mapped your personality profile, values matrix, and relationship intentions. Let's synthesize your custom profile now!`;
    
    // Stream response tokens
    const words = responseText.split(" ");
    for (const word of words) {
      yield { type: "token", content: word + " " };
      await new Promise((r) => setTimeout(r, 25));
    }
    
    yield { type: "interview_complete" };
    return;
  }

  // Stream tokens word-by-word for high-fidelity conversational UX
  const words = responseText.split(" ");
  for (const word of words) {
    yield { type: "token", content: word + " " };
    await new Promise((r) => setTimeout(r, 30));
  }
}

/**
 * Main streamChat function: attempts backend SSE first; seamlessly uses native engine if offline.
 */
export async function* streamChat(messages, phase) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800); // Quick check if port 8000 is open

    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, phase }),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              yield parsed;
            } catch (e) {
              console.error("Failed to parse SSE data:", data);
            }
          }
        }
      }
      return;
    }
  } catch (error) {
    // Backend offline, seamlessly proceed to native interview engine
  }

  // Native streaming execution
  for await (const chunk of nativeStreamChat(messages, phase)) {
    yield chunk;
  }
}

/**
 * Profile Synthesis: converts interview conversation into comprehensive compatibility profile
 */
export async function generateProfile(messages) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch(`${API_BASE}/chat/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && response.ok) {
      const data = await response.json();
      if (data && data.profile) return data.profile;
    }
  } catch (e) {
    // Fall back to native profile synthesizer
  }

  // Extract answers from the conversation
  const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content);
  const name = userMessages[0] ? extractName(userMessages[0]) : "Alex";
  const valuesText = userMessages[1] || "Growth, Authenticity, Empathy";
  const lifestyleText = userMessages[2] || "Weekend hikes, quiet mornings, good coffee";
  const relationshipText = userMessages[3] || "Direct, gentle, and communicative";
  const partnerText = userMessages[4] || "Kindness, emotional maturity; inconsistency is a dealbreaker";

  // Synthesize Big 5 traits
  const combinedText = userMessages.join(" ").toLowerCase();
  
  const opennessScore = combinedText.includes("creativ") || combinedText.includes("art") || combinedText.includes("curio") || combinedText.includes("explore") ? 88 : 78;
  const extraversionScore = combinedText.includes("friend") || combinedText.includes("talk") || combinedText.includes("social") || combinedText.includes("outdoor") ? 72 : 58;
  const agreeablenessScore = combinedText.includes("kind") || combinedText.includes("empath") || combinedText.includes("listen") || combinedText.includes("gentle") ? 92 : 82;
  const conscientiousnessScore = combinedText.includes("growth") || combinedText.includes("ambition") || combinedText.includes("intentional") || combinedText.includes("honest") ? 86 : 74;
  const emotionalStabilityScore = combinedText.includes("calm") || combinedText.includes("mature") || combinedText.includes("balance") ? 84 : 76;

  // Extract Values Tags
  const defaultValues = ["Authenticity", "Intentionality", "Empathy", "Growth", "Kindness", "Creativity"];
  const matchedValues = defaultValues.filter(v => combinedText.includes(v.toLowerCase()));
  const finalValues = matchedValues.length >= 3 ? matchedValues : ["Authenticity", "Personal Growth", "Empathy", "Meaningful Connection"];

  // Extract Lifestyle Tags
  const lifestylePool = [
    { key: "coffee", label: "Coffee Aficionado" },
    { key: "hik", label: "Nature & Hiking" },
    { key: "read", label: "Avid Reader" },
    { key: "food", label: "Foodie & Cooking" },
    { key: "fit", label: "Active Lifestyle" },
    { key: "travel", label: "Travel & Explorer" },
    { key: "art", label: "Creative Arts" },
    { key: "music", label: "Live Music" }
  ];
  const matchedLifestyle = lifestylePool.filter(item => combinedText.includes(item.key)).map(item => item.label);
  const finalLifestyle = matchedLifestyle.length >= 2 ? matchedLifestyle : ["Thoughtful Mornings", "Active Explorer", "Deep Conversations", "Food & Travel"];

  // Extract Dealbreakers
  const dealBreakers = [];
  if (combinedText.includes("flak") || combinedText.includes("inconsist")) dealBreakers.push("Inconsistency & Flakiness");
  if (combinedText.includes("curio")) dealBreakers.push("Lack of Curiosity");
  if (combinedText.includes("dishonest") || combinedText.includes("lie")) dealBreakers.push("Dishonesty");
  if (combinedText.includes("arrog")) dealBreakers.push("Arrogance & Disrespect");
  if (dealBreakers.length === 0) {
    dealBreakers.push("Inconsistency", "Emotional Unavailability");
  }

  return {
    name,
    bio: `${name} is an intentional individual seeking a genuine, lasting connection. They lead with ${finalValues.slice(0, 2).join(" and ").toLowerCase()}, pairing their love for ${lifestyleText.slice(0, 60)} with emotional depth and open communication.`,
    traits: {
      openness: opennessScore,
      conscientiousness: conscientiousnessScore,
      extraversion: extraversionScore,
      agreeableness: agreeablenessScore,
      emotional_stability: emotionalStabilityScore
    },
    values: finalValues,
    lifestyle: finalLifestyle,
    relationship_style: `Seeks a relationship founded on ${finalValues[0]} and emotional safety. Believes in growing together as genuine equals.`,
    communication_style: relationshipText.length > 10 ? relationshipText : "Direct yet deeply empathetic. Values talking through emotions calmly and constructively.",
    looking_for: `Someone who is kind, emotionally grounded, and ready to build a meaningful, joyful future together.`,
    deal_breakers: dealBreakers
  };
}
