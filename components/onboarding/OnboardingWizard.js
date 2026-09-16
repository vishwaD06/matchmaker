"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./OnboardingWizard.module.css";
import Button from "../ui/Button";

const STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Photos" },
  { id: 3, label: "Wave Voice" },
  { id: 4, label: "Preferences" },
  { id: 5, label: "Optional Details" },
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Account Basics
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState("Man");
  const [selfie, setSelfie] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  // Step 2: Photos (Minimum 5)
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Step 3: Voice with Wave
  const [waveStep, setWaveStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isWaveSpeaking, setIsWaveSpeaking] = useState(false);
  const [waveTranscript, setWaveTranscript] = useState("");
  const [voiceAnswers, setVoiceAnswers] = useState([]);
  const [textModeInput, setTextModeInput] = useState("");
  const recognitionRef = useRef(null);

  // Step 4: Core Preferences
  const [minAge, setMinAge] = useState(24);
  const [maxAge, setMaxAge] = useState(34);
  const [relationshipType, setRelationshipType] = useState("Long-term relationship");
  const [heightPref, setHeightPref] = useState("Open to any height");
  const [location, setLocation] = useState("San Francisco, CA");
  const [distanceRadius, setDistanceRadius] = useState(25);

  // Step 5: Optional Details
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [bioNote, setBioNote] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Calculate age from DOB
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge >= 18 ? calculatedAge : null);
    } else {
      setAge(null);
    }
  }, [dob]);

  // Handle Camera for Selfie Verification
  const startCamera = async () => {
    setErrorMsg("");
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied, fallback to file upload", err);
      setIsCameraActive(false);
      setErrorMsg("Camera access not available. Please upload a selfie photograph instead.");
    }
  };

  const captureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setSelfie(dataUrl);

      // Stop camera tracks
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setIsCameraActive(false);
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfie(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Photos (Step 2)
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 6));
    setErrorMsg("");
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 3: Wave Voice Interaction
  const WAVE_QUESTIONS = [
    {
      title: "Intent & Core Vision",
      prompt: "Hi there, I'm Wave. What are your core intentions for joining Matchmaker, and what does an ideal, healthy relationship look like for you?",
      chipOptions: [
        "Seeking a committed life partner",
        "Intentional dating with mutual respect",
        "Deep emotional connection and growth"
      ]
    },
    {
      title: "Relationship History & Lessons",
      prompt: "Reflecting on your relationship journey, what is the most important lesson you've learned about what you truly need from a partner?",
      chipOptions: [
        "Consistent communication is everything",
        "Maintaining independence while growing together",
        "Vulnerability and emotional maturity"
      ]
    },
    {
      title: "Non-Negotiables & Deal-Breakers",
      prompt: "To help us protect your energy: what are your absolute non-negotiables or deal-breakers in a partner?",
      chipOptions: [
        "Inconsistency & lack of curiosity",
        "Dishonesty & emotional unavailability",
        "Negativity & lack of ambition"
      ]
    }
  ];

  const speakWavePrompt = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onstart = () => setIsWaveSpeaking(true);
      utterance.onend = () => setIsWaveSpeaking(false);
      utterance.onerror = () => setIsWaveSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start speech recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Voice recognition not supported in this browser. Please use text responses below.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg("");
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setWaveTranscript(transcript);
    };

    recognition.onerror = (event) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleNextWaveQuestion = (answerText) => {
    const finalAnswer = answerText || waveTranscript || textModeInput;
    if (!finalAnswer.trim()) {
      setErrorMsg("Please share your thoughts via voice or type your answer to continue.");
      return;
    }

    const updatedAnswers = [...voiceAnswers, finalAnswer];
    setVoiceAnswers(updatedAnswers);
    setWaveTranscript("");
    setTextModeInput("");
    setErrorMsg("");

    if (waveStep < WAVE_QUESTIONS.length - 1) {
      const nextStep = waveStep + 1;
      setWaveStep(nextStep);
      speakWavePrompt(WAVE_QUESTIONS[nextStep].prompt);
    } else {
      // Wave interview done, proceed to step 4
      setCurrentStep(4);
    }
  };

  // Navigation & Validations
  const handleNextStep = () => {
    setErrorMsg("");

    if (currentStep === 1) {
      if (!fullName.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!dob || !age || age < 18) {
        setErrorMsg("You must be at least 18 years old to join.");
        return;
      }
      if (!selfie) {
        setErrorMsg("Please capture or upload a verification selfie to verify your identity.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (photos.length < 5) {
        setErrorMsg(`Please upload at least 5 photographs (currently: ${photos.length}/5).`);
        return;
      }
      setCurrentStep(3);
      // Trigger Wave's first prompt
      setTimeout(() => speakWavePrompt(WAVE_QUESTIONS[0].prompt), 400);
    } else if (currentStep === 3) {
      handleNextWaveQuestion();
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      handleFinalSynthesis();
    }
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Final Synthesis & Saving to SessionStorage
  const handleFinalSynthesis = () => {
    setIsSynthesizing(true);

    const synthesizedProfile = {
      name: fullName.trim(),
      age: age || 27,
      gender: gender,
      location: location,
      isVerified: true,
      selfie: selfie,
      photos: photos,
      bio: bioNote || `${fullName} is an intentional ${gender.toLowerCase()} seeking a deep, long-term partnership in ${location}. They value authenticity, emotional maturity, and mutual growth.`,
      traits: {
        openness: 88,
        conscientiousness: 84,
        extraversion: 72,
        agreeableness: 90,
        emotional_stability: 82,
      },
      values: ["Authenticity", "Intentionality", "Mutual Growth", "Deep Empathy"],
      lifestyle: ["Active & Grounded", "Weekend Explorer", "Thoughtful Conversations"],
      relationship_style: `Seeking a ${relationshipType.toLowerCase()} with clear intentions, shared humor, and emotional security.`,
      communication_style: voiceAnswers[1] || "Direct yet gentle. Values working through misunderstandings face-to-face.",
      looking_for: `Someone aged ${minAge}-${maxAge} (${heightPref}) in ${location} seeking meaningful connection.`,
      deal_breakers: voiceAnswers[2] ? [voiceAnswers[2]] : ["Inconsistency", "Dishonesty", "Lack of curiosity"],
      linkedin: linkedinUrl || null,
      instagram: instagram || null,
    };

    sessionStorage.setItem("matchmaker_profile", JSON.stringify(synthesizedProfile));

    setTimeout(() => {
      router.push("/profile");
    }, 2400);
  };

  return (
    <div className={styles.container}>
      {/* Top Header & Stepper */}
      <header className={styles.header}>
        <div className={styles.topRow}>
          <Link href="/" className={styles.brand}>
            MATCHMAKER
          </Link>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Step {currentStep} of 5
          </span>
        </div>

        <div className={styles.stepper}>
          <div className={styles.stepperLine}>
            <div
              className={styles.stepperLineProgress}
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <div
                key={step.id}
                className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ""} ${isCompleted ? styles.stepItemCompleted : ""
                  }`}
              >
                <div className={styles.stepCircle}>
                  {isCompleted ? "✓" : step.id}
                </div>
                <span className={styles.stepLabel}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Main Form Content */}
      <main className={styles.mainContent}>
        <div className={styles.wizardCard}>
          {/* STEP 1: ACCOUNT BASICS */}
          {currentStep === 1 && (
            <div>
              <div className={styles.stepHeader}>
                <div className={styles.stepBadge}>Step 1 · Account Basics</div>
                <h1 className={styles.stepTitle}>Who are you?</h1>
                <p className={styles.stepDesc}>
                  Provide mandatory profile details to build a trustworthy, verified presence.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={styles.input}
                  autoFocus
                />
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Calculated Age</label>
                  <input
                    type="text"
                    value={age ? `${age} years old` : "Enter DOB above"}
                    readOnly
                    className={styles.input}
                    style={{ background: "rgba(255,255,255,0.02)", cursor: "default" }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Gender</label>
                <div className={styles.optionsGrid}>
                  {["Man", "Woman", "Non-binary"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`${styles.optionBtn} ${gender === opt ? styles.optionBtnActive : ""}`}
                      onClick={() => setGender(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verification Selfie */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Verification Selfie (Mandatory)</label>
                <div className={`${styles.selfieBox} ${selfie ? styles.selfieBoxVerified : ""}`}>
                  {selfie ? (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selfie} alt="Verification Selfie" className={styles.selfiePreview} />
                      <div className={styles.verifiedPill}>
                        <span>✓</span> Verified Identity
                      </div>
                      <div style={{ marginTop: "0.75rem" }}>
                        <button
                          type="button"
                          onClick={() => setSelfie(null)}
                          style={{ color: "var(--text-secondary)", fontSize: "0.8rem", textDecoration: "underline" }}
                        >
                          Retake photo
                        </button>
                      </div>
                    </div>
                  ) : isCameraActive ? (
                    <div>
                      <video ref={videoRef} autoPlay playsInline className={styles.cameraFeed} />
                      <Button variant="primary" onClick={captureSelfie}>
                        Take Snapshot
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                        Take a quick selfie or upload a portrait to verify you are really you.
                      </p>
                      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <Button variant="primary" onClick={startCamera}>
                          Use Camera
                        </Button>
                        <label className={styles.optionBtn} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                          Upload Photo
                          <input type="file" accept="image/*" onChange={handleSelfieUpload} style={{ display: "none" }} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PHOTO UPLOAD */}
          {currentStep === 2 && (
            <div>
              <div className={styles.stepHeader}>
                <div className={styles.stepBadge}>Step 2 · Photo Upload</div>
                <h1 className={styles.stepTitle}>Show your world</h1>
                <p className={styles.stepDesc}>
                  Upload a minimum of five photographs so our AI can understand your lifestyle, aesthetic, and daily vibe.
                </p>
              </div>

              <div className={styles.photoCounter}>
                <span>Uploaded:</span>
                <span className={styles.photoCounterHighlight}>
                  {photos.length} of 5 minimum required {photos.length >= 5 ? "✓ (Unlocked)" : ""}
                </span>
              </div>

              <div className={styles.photosGrid}>
                {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                  const photoSrc = photos[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className={`${styles.photoSlot} ${photoSrc ? styles.photoSlotFilled : ""}`}
                      onClick={() => !photoSrc && fileInputRef.current?.click()}
                    >
                      <span className={styles.slotNumber}>{slotIdx + 1}</span>
                      {photoSrc ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photoSrc} alt={`Photo ${slotIdx + 1}`} className={styles.photoImg} />
                          <button
                            type="button"
                            className={styles.removePhotoBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              removePhoto(slotIdx);
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <span style={{ fontSize: "1.8rem", color: "var(--text-muted)" }}>+</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />

              <div style={{ textAlign: "center" }}>
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  Select Photos from Device
                </Button>
              </div>

              {photos.length >= 5 && (
                <div className={styles.aiAnalysisBox}>
                  <span style={{ fontSize: "1.2rem" }}>✨</span>
                  <div>
                    <strong style={{ color: "var(--accent-primary)" }}>AI Aesthetic Detection Active:</strong>
                    <p style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Lifestyle: Outdoors & Social · Aesthetic: Casual Elegance · Expression: Authentic
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: VOICE CONVERSATION WITH WAVE */}
          {currentStep === 3 && (
            <div>
              <div className={styles.stepHeader}>
                <div className={styles.stepBadge}>Step 3 · Voice Conversation</div>
                <h1 className={styles.stepTitle}>Conversation with Wave</h1>
                <p className={styles.stepDesc}>
                  Engage in an interactive voice conversation with Wave to discuss your preferences, relationship history, intent, and non-negotiables.
                </p>
              </div>

              <div className={styles.waveBox}>
                <div
                  className={styles.waveSphere}
                  onClick={toggleListening}
                  title="Click to speak with Wave"
                >
                  {isListening && <div className={styles.wavePulse} />}
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>

                <div className={styles.visualizerBars}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                    <div
                      key={i}
                      className={styles.visBar}
                      style={{
                        animationDuration: `${0.6 + (i % 5) * 0.15}s`,
                        opacity: isListening || isWaveSpeaking ? 1 : 0.25,
                      }}
                    />
                  ))}
                </div>

                <p style={{ fontSize: "0.85rem", color: isListening ? "var(--accent-primary)" : "var(--text-secondary)" }}>
                  {isListening
                    ? "Wave is listening to you... (Speak freely)"
                    : isWaveSpeaking
                      ? "Wave is speaking..."
                      : "Tap the sphere to speak with Wave"}
                </p>
              </div>

              {/* Wave Question */}
              <div className={styles.voiceQuestionCard}>
                <div className={styles.voiceSpeaker}>
                  Wave · Question {waveStep + 1} of 3: {WAVE_QUESTIONS[waveStep].title}
                </div>
                <div className={styles.voiceText}>{WAVE_QUESTIONS[waveStep].prompt}</div>

                {/* Quick prompts */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
                  {WAVE_QUESTIONS[waveStep].chipOptions.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.optionBtn}
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
                      onClick={() => handleNextWaveQuestion(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Transcript / Fallback text input */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Voice Transcript / Response</label>
                <input
                  type="text"
                  placeholder="Transcript will appear here as you speak, or type your answer..."
                  value={waveTranscript || textModeInput}
                  onChange={(e) => setTextModeInput(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {/* STEP 4: CORE PREFERENCES */}
          {currentStep === 4 && (
            <div>
              <div className={styles.stepHeader}>
                <div className={styles.stepBadge}>Step 4 · Core Preferences</div>
                <h1 className={styles.stepTitle}>Who inspires you?</h1>
                <p className={styles.stepDesc}>
                  Input key preferences such as your desired age range, relationship type, height, and location.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Desired Age Range: {minAge} - {maxAge} years old
                </label>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={minAge}
                    onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                    style={{ flex: 1, accentColor: "var(--accent-primary)" }}
                  />
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                    style={{ flex: 1, accentColor: "var(--accent-primary)" }}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Type of Relationship Sought</label>
                <div className={styles.optionsGrid}>
                  {[
                    "Long-term relationship",
                    "Marriage / Life partner",
                    "Intentional dating",
                    "Taking it slow"
                  ].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.optionBtn} ${relationshipType === type ? styles.optionBtnActive : ""}`}
                      onClick={() => setRelationshipType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Height Preference</label>
                  <select
                    value={heightPref}
                    onChange={(e) => setHeightPref(e.target.value)}
                    className={styles.input}
                    style={{ cursor: "pointer" }}
                  >
                    <option>Open to any height</option>
                    <option>5'6" (168 cm) and above</option>
                    <option>5'9" (175 cm) and above</option>
                    <option>6'0" (183 cm) and above</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Approximate Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Distance Radius: {distanceRadius} miles</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={distanceRadius}
                  onChange={(e) => setDistanceRadius(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--accent-primary)" }}
                />
              </div>
            </div>
          )}

          {/* STEP 5: OPTIONAL DETAILS & SYNTHESIS */}
          {currentStep === 5 && (
            <div>
              <div className={styles.stepHeader}>
                <div className={styles.stepBadge}>Step 5 · Optional Details</div>
                <h1 className={styles.stepTitle}>Final touches</h1>
                <p className={styles.stepDesc}>
                  Add supplementary information like an optional LinkedIn URL for verified professional context.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>LinkedIn Profile URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className={styles.input}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                  Used for verified education & career credentials.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Instagram / Social Handle (Optional)</label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Personal Headline / Bio Note (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="Share a thought, favorite book, or what makes you smile..."
                  value={bioNote}
                  onChange={(e) => setBioNote(e.target.value)}
                  className={styles.input}
                  style={{ resize: "none" }}
                />
              </div>

              {/* Summary recap */}
              <div style={{ background: "rgba(255,255,255,0.03)", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-subtle)", marginTop: "1rem" }}>
                <strong style={{ color: "var(--accent-primary)", display: "block", marginBottom: "0.5rem" }}>
                  Profile Readiness Checklist:
                </strong>
                <ul style={{ listStyle: "none", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <li>✓ Account Basics: {fullName} ({age} y/o {gender})</li>
                  <li>✓ Verification Selfie Confirmed</li>
                  <li>✓ {photos.length} High-Res Lifestyle Photos Uploaded</li>
                  <li>✓ Wave AI Voice Consultation Complete</li>
                  <li>✓ Core Preferences & Location Configured</li>
                </ul>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && <div className={styles.errorText}>⚠ {errorMsg}</div>}

          {/* Bottom Action Bar */}
          <div className={styles.actionRow}>
            {currentStep > 1 ? (
              <Button variant="secondary" onClick={handlePrevStep} disabled={isSynthesizing}>
                ← Back
              </Button>
            ) : (
              <div />
            )}

            <Button variant="primary" onClick={handleNextStep} disabled={isSynthesizing}>
              {isSynthesizing
                ? "Synthesizing..."
                : currentStep === 5
                  ? "Complete & Build Profile →"
                  : currentStep === 3
                    ? "Next Question →"
                    : "Continue →"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
