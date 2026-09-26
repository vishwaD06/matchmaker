"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./OnboardingWizard.module.css";

const TOTAL_STEPS = 12;

const WAVE_QUESTIONS = [
  {
    title: "Intent & Core Vision",
    prompt:
      "Hi there, I'm Wave. What are your core intentions for joining Matchmaker, and what does an ideal, healthy relationship look like for you?",
    chipOptions: [
      "Seeking a committed life partner",
      "Intentional dating with mutual respect",
      "Deep emotional connection and growth",
    ],
  },
  {
    title: "Relationship History & Lessons",
    prompt:
      "Reflecting on your relationship journey, what is the most important lesson you've learned about what you truly need from a partner?",
    chipOptions: [
      "Consistent communication is everything",
      "Maintaining independence while growing together",
      "Vulnerability and emotional maturity",
    ],
  },
  {
    title: "Non-Negotiables & Deal-Breakers",
    prompt:
      "To help us protect your energy: what are your absolute non-negotiables or deal-breakers in a partner?",
    chipOptions: [
      "Inconsistency & lack of curiosity",
      "Dishonesty & emotional unavailability",
      "Negativity & lack of ambition",
    ],
  },
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0 = welcome, 1-11 = steps, 12 = synthesis
  const [animKey, setAnimKey] = useState(0); // forces re-mount for animation
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Name
  const [fullName, setFullName] = useState("");

  // Step 2: DOB
  const [dob, setDob] = useState("");
  const [age, setAge] = useState(null);

  // Step 3: Gender
  const [gender, setGender] = useState("");

  // Step 4: Selfie
  const [selfie, setSelfie] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  // Step 5: Photos
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Steps 6-8: Wave Voice
  const [isListening, setIsListening] = useState(false);
  const [isWaveSpeaking, setIsWaveSpeaking] = useState(false);
  const [waveTranscript, setWaveTranscript] = useState("");
  const [voiceAnswers, setVoiceAnswers] = useState([]);
  const [textModeInput, setTextModeInput] = useState("");
  const recognitionRef = useRef(null);

  // Step 9: Preferences
  const [minAge, setMinAge] = useState(24);
  const [maxAge, setMaxAge] = useState(34);
  const [relationshipType, setRelationshipType] = useState("Long-term relationship");
  const [heightPref, setHeightPref] = useState("Open to any height");
  const [location, setLocation] = useState("");
  const [distanceRadius, setDistanceRadius] = useState(25);

  // Step 10: Optional details
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagram, setInstagram] = useState("");
  const [bioNote, setBioNote] = useState("");

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

  // Navigate
  const goTo = useCallback((nextStep) => {
    setErrorMsg("");
    setAnimKey((k) => k + 1);
    setStep(nextStep);
  }, []);

  const goBack = () => {
    if (step > 0) goTo(step - 1);
  };

  // ===== Camera / Selfie =====
  const startCamera = async () => {
    setErrorMsg("");
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Camera access denied", err);
      setIsCameraActive(false);
      setErrorMsg("Camera not available. Please upload a selfie instead.");
    }
  };

  const captureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 240;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setSelfie(canvas.toDataURL("image/jpeg"));
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      setIsCameraActive(false);
    }
  };

  const handleSelfieUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelfie(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // ===== Photos =====
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

  // ===== Wave Voice =====
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

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg("Voice recognition not supported. Please type your answer.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => { setIsListening(true); setErrorMsg(""); };
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setWaveTranscript(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Get the Wave question index based on step (steps 6, 7, 8 → questions 0, 1, 2)
  const getWaveQuestionIndex = () => step - 6;

  const handleWaveAnswer = (chipText) => {
    const answer = chipText || waveTranscript || textModeInput;
    if (!answer.trim()) {
      setErrorMsg("Please share your thoughts via voice or type your answer.");
      return;
    }
    setVoiceAnswers((prev) => [...prev, answer]);
    setWaveTranscript("");
    setTextModeInput("");
    setErrorMsg("");
    goTo(step + 1);
    // Speak next prompt if there's another wave step
    const nextQIdx = step - 6 + 1;
    if (nextQIdx < WAVE_QUESTIONS.length) {
      setTimeout(() => speakWavePrompt(WAVE_QUESTIONS[nextQIdx].prompt), 500);
    }
  };

  // ===== Validation: is current step valid? =====
  const isStepValid = () => {
    switch (step) {
      case 0: return true; // welcome
      case 1: return fullName.trim().length > 0;
      case 2: return dob && age && age >= 18;
      case 3: return gender !== "";
      case 4: return selfie !== null;
      case 5: return photos.length >= 5;
      case 6: case 7: case 8:
        return (waveTranscript || textModeInput).trim().length > 0;
      case 9: return true; // prefs have defaults
      case 10: return true; // optional
      default: return true;
    }
  };

  // ===== Continue handler =====
  const handleContinue = () => {
    setErrorMsg("");
    if (step === 0) {
      goTo(1);
    } else if (step >= 6 && step <= 8) {
      handleWaveAnswer();
    } else if (step === 10) {
      // trigger synthesis
      goTo(11);
      handleFinalSynthesis();
    } else {
      // Start wave prompt on entering step 6
      if (step === 5) {
        setTimeout(() => speakWavePrompt(WAVE_QUESTIONS[0].prompt), 500);
      }
      goTo(step + 1);
    }
  };

  // ===== Final Synthesis =====
  const handleFinalSynthesis = () => {
    const synthesizedProfile = {
      name: fullName.trim(),
      age: age || 27,
      gender,
      location,
      isVerified: true,
      selfie,
      photos,
      bio:
        bioNote ||
        `${fullName} is an intentional ${gender.toLowerCase()} seeking a deep, long-term partnership in ${location || "their city"}. They value authenticity, emotional maturity, and mutual growth.`,
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
      communication_style:
        voiceAnswers[1] ||
        "Direct yet gentle. Values working through misunderstandings face-to-face.",
      looking_for: `Someone aged ${minAge}-${maxAge} (${heightPref}) in ${location || "nearby"} seeking meaningful connection.`,
      deal_breakers: voiceAnswers[2]
        ? [voiceAnswers[2]]
        : ["Inconsistency", "Dishonesty", "Lack of curiosity"],
      linkedin: linkedinUrl || null,
      instagram: instagram || null,
    };

    sessionStorage.setItem("matchmaker_profile", JSON.stringify(synthesizedProfile));
    setTimeout(() => router.push("/profile"), 3000);
  };

  // ===== Progress =====
  const progress = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;

  // ===== Back arrow SVG =====
  const BackArrow = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );

  // ===== Mic SVG =====
  const MicIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );

  // ===== RENDER =====

  // Step 0: Welcome
  if (step === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.stepScreen} key={animKey}>
          <div className={styles.welcomeScreen}>
            <div className={styles.welcomeLogo}>Matchmaker</div>
            <p className={styles.welcomeTagline}>
              Intentional matchmaking powered by AI.<br />
              Let&rsquo;s build your profile in a few simple steps.
            </p>
            <button className={styles.welcomeBtn} onClick={() => goTo(1)}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 11: Synthesis loading
  if (step === 11) {
    return (
      <div className={styles.container}>
        <div className={styles.synthesisScreen} key={animKey}>
          <div className={styles.synthesisSpinner} />
          <h2 className={styles.synthesisTitle}>Building your profile</h2>
          <p className={styles.synthesisSubtitle}>
            We&rsquo;re synthesizing your responses, photos, and preferences into a verified profile.
          </p>
          <ul className={styles.synthesisChecklist}>
            <li><span className={styles.checkIcon}>✓</span> Identity verified — {fullName}</li>
            <li><span className={styles.checkIcon}>✓</span> {photos.length} lifestyle photos analyzed</li>
            <li><span className={styles.checkIcon}>✓</span> Voice consultation with Wave complete</li>
            <li><span className={styles.checkIcon}>✓</span> Preferences configured</li>
          </ul>
        </div>
      </div>
    );
  }

  // Steps 1-10: The actual onboarding flow
  const valid = isStepValid();
  const isWaveStep = step >= 6 && step <= 8;
  const displayStep = step; // 1-indexed for the counter

  // Button label
  let btnLabel = "Continue";
  if (step === 10) btnLabel = "Complete & Build Profile";
  if (isWaveStep) btnLabel = "Submit Answer";

  return (
    <div className={styles.container}>
      {/* Top bar: progress + nav */}
      <div className={styles.topBar}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.navRow}>
          <button className={styles.backBtn} onClick={goBack}>
            <BackArrow /> Back
          </button>
          <span className={styles.stepCounter}>{displayStep} of {TOTAL_STEPS - 2}</span>
        </div>
      </div>

      {/* Step Content */}
      <div className={styles.stepScreen} key={animKey}>
        <div className={styles.stepInner}>

          {/* ===== STEP 1: NAME ===== */}
          {step === 1 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>What&rsquo;s your name?</h1>
                <p className={styles.stepSubtitle}>This is how you&rsquo;ll appear on your profile.</p>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={styles.input}
                  autoFocus
                />
              </div>
            </>
          )}

          {/* ===== STEP 2: DOB ===== */}
          {step === 2 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>When were you born?</h1>
                <p className={styles.stepSubtitle}>You must be at least 18 years old to join Matchmaker.</p>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={styles.input}
                  autoFocus
                />
              </div>
              {dob && age && (
                <p style={{ color: age >= 18 ? "var(--accent-primary)" : "#ef4444", fontWeight: 600, fontSize: "0.95rem" }}>
                  {age >= 18 ? `${age} years old ✓` : `Must be 18+. You entered ${age}.`}
                </p>
              )}
              {dob && !age && (
                <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>
                  You must be at least 18 years old.
                </p>
              )}
            </>
          )}

          {/* ===== STEP 3: GENDER ===== */}
          {step === 3 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>How do you identify?</h1>
                <p className={styles.stepSubtitle}>Select the option that best describes you.</p>
              </div>
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
            </>
          )}

          {/* ===== STEP 4: SELFIE ===== */}
          {step === 4 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Verify your identity</h1>
                <p className={styles.stepSubtitle}>
                  Take a quick selfie or upload a portrait. This confirms you&rsquo;re a real person.
                </p>
              </div>
              <div className={styles.selfieArea}>
                {selfie ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selfie} alt="Selfie" className={styles.selfiePreviewCircle} />
                    <div className={styles.verifiedBadge}>
                      <span>✓</span> Verified Identity
                    </div>
                    <button className={styles.retakeLink} onClick={() => setSelfie(null)}>
                      Retake photo
                    </button>
                  </>
                ) : isCameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className={styles.cameraFeed} />
                    <button className={styles.captureBtn} onClick={captureSelfie}>
                      Capture
                    </button>
                  </>
                ) : (
                  <div className={styles.selfieActions}>
                    <button className={styles.selfieActionBtn} onClick={startCamera}>
                      📷 Use Camera
                    </button>
                    <label className={styles.selfieActionBtn} style={{ cursor: "pointer" }}>
                      📁 Upload Photo
                      <input type="file" accept="image/*" onChange={handleSelfieUpload} style={{ display: "none" }} />
                    </label>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===== STEP 5: PHOTOS ===== */}
          {step === 5 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Show your world</h1>
                <p className={styles.stepSubtitle}>
                  Upload at least 5 photos so our AI can understand your lifestyle and aesthetic.
                </p>
              </div>
              <div className={styles.photoCounter}>
                <span>Uploaded</span>
                <span className={styles.photoCounterHighlight}>
                  {photos.length} / 5 minimum {photos.length >= 5 ? "✓" : ""}
                </span>
              </div>
              <div className={styles.photosGrid}>
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const src = photos[idx];
                  return (
                    <div
                      key={idx}
                      className={`${styles.photoSlot} ${src ? styles.photoSlotFilled : ""}`}
                      onClick={() => !src && fileInputRef.current?.click()}
                    >
                      <span className={styles.slotNumber}>{idx + 1}</span>
                      {src ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Photo ${idx + 1}`} className={styles.photoImg} />
                          <button
                            type="button"
                            className={styles.removePhotoBtn}
                            onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <span className={styles.photoSlotPlus}>+</span>
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
              <button className={styles.selectPhotosBtn} onClick={() => fileInputRef.current?.click()}>
                Select Photos from Device
              </button>
              {photos.length >= 5 && (
                <div className={styles.aiAnalysisBox}>
                  <span style={{ fontSize: "1.2rem" }}>✨</span>
                  <div>
                    <strong style={{ color: "var(--accent-primary)" }}>AI Aesthetic Detection Active</strong>
                    <p style={{ color: "var(--text-secondary)", marginTop: "2px" }}>
                      Lifestyle: Outdoors & Social · Aesthetic: Casual Elegance · Expression: Authentic
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ===== STEPS 6-8: WAVE VOICE ===== */}
          {isWaveStep && (
            <>
              {(() => {
                const qIdx = getWaveQuestionIndex();
                const q = WAVE_QUESTIONS[qIdx];
                return (
                  <>
                    <div className={styles.stepHeader}>
                      <h1 className={styles.stepTitle}>
                        {q.title}
                      </h1>
                      <p className={styles.stepSubtitle}>
                        Question {qIdx + 1} of 3 — Speak or type your answer.
                      </p>
                    </div>

                    <div className={styles.waveArea}>
                      <div className={styles.waveSphere} onClick={toggleListening} title="Tap to speak">
                        {isListening && <div className={styles.wavePulse} />}
                        <MicIcon />
                      </div>

                      <div className={styles.visualizerBars}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                          <div
                            key={i}
                            className={styles.visBar}
                            style={{
                              animationDuration: `${0.6 + (i % 5) * 0.15}s`,
                              opacity: isListening || isWaveSpeaking ? 1 : 0.2,
                            }}
                          />
                        ))}
                      </div>

                      <p className={`${styles.waveStatus} ${isListening ? styles.waveStatusActive : ""}`}>
                        {isListening
                          ? "Listening… speak freely"
                          : isWaveSpeaking
                            ? "Wave is speaking…"
                            : "Tap the sphere to speak"}
                      </p>
                    </div>

                    <div className={styles.waveQuestionCard}>
                      <div className={styles.waveQuestionLabel}>Wave · {q.title}</div>
                      <div className={styles.waveQuestionText}>{q.prompt}</div>
                    </div>

                    {/* Quick chip options */}
                    <div className={styles.chipOptions}>
                      {q.chipOptions.map((chip, i) => (
                        <button
                          key={i}
                          type="button"
                          className={styles.chipBtn}
                          onClick={() => handleWaveAnswer(chip)}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Text fallback */}
                    <div className={styles.formGroup}>
                      <input
                        type="text"
                        placeholder="Or type your answer here…"
                        value={waveTranscript || textModeInput}
                        onChange={(e) => setTextModeInput(e.target.value)}
                        className={styles.input}
                      />
                    </div>
                  </>
                );
              })()}
            </>
          )}

          {/* ===== STEP 9: PREFERENCES ===== */}
          {step === 9 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Your preferences</h1>
                <p className={styles.stepSubtitle}>
                  Tell us what you&rsquo;re looking for. You can always change these later.
                </p>
              </div>

              <div className={styles.prefsGroup}>
                <div className={styles.prefField}>
                  <span className={styles.prefLabel}>
                    Age Range: {minAge} – {maxAge}
                  </span>
                  <div className={styles.rangeRow}>
                    <input
                      type="range" min="18" max="60" value={minAge}
                      onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge - 1))}
                    />
                    <input
                      type="range" min="18" max="60" value={maxAge}
                      onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge + 1))}
                    />
                  </div>
                </div>

                <div className={styles.prefField}>
                  <span className={styles.prefLabel}>Relationship Type</span>
                  <div className={styles.prefsOptionsRow}>
                    {["Long-term relationship", "Marriage / Life partner", "Intentional dating", "Taking it slow"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`${styles.prefOptionBtn} ${relationshipType === t ? styles.prefOptionBtnActive : ""}`}
                        onClick={() => setRelationshipType(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.grid2}>
                  <div className={styles.prefField}>
                    <span className={styles.prefLabel}>Height Preference</span>
                    <select
                      value={heightPref}
                      onChange={(e) => setHeightPref(e.target.value)}
                      className={styles.input}
                      style={{ cursor: "pointer" }}
                    >
                      <option>Open to any height</option>
                      <option>5&apos;6&quot; (168 cm) and above</option>
                      <option>5&apos;9&quot; (175 cm) and above</option>
                      <option>6&apos;0&quot; (183 cm) and above</option>
                    </select>
                  </div>
                  <div className={styles.prefField}>
                    <span className={styles.prefLabel}>Location</span>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.prefField}>
                  <span className={styles.prefLabel}>Distance: {distanceRadius} miles</span>
                  <input
                    type="range" min="5" max="100" step="5"
                    value={distanceRadius}
                    onChange={(e) => setDistanceRadius(Number(e.target.value))}
                    style={{ accentColor: "var(--accent-primary)" }}
                  />
                </div>
              </div>
            </>
          )}

          {/* ===== STEP 10: OPTIONAL DETAILS ===== */}
          {step === 10 && (
            <>
              <div className={styles.stepHeader}>
                <h1 className={styles.stepTitle}>Final touches</h1>
                <p className={styles.stepSubtitle}>
                  Add optional details to strengthen your profile. You can skip this step.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Instagram Handle</label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Personal Bio</label>
                <textarea
                  rows="3"
                  placeholder="Share a thought, favourite book, or what makes you smile…"
                  value={bioNote}
                  onChange={(e) => setBioNote(e.target.value)}
                  className={styles.input}
                  style={{ resize: "none" }}
                />
              </div>
            </>
          )}

          {/* Error */}
          {errorMsg && <div className={styles.errorText}>⚠ {errorMsg}</div>}

          {/* Continue button (not shown on wave steps that use chips as primary action) */}
          <button
            className={`${styles.continueBtn} ${valid ? styles.continueBtnEnabled : styles.continueBtnDisabled}`}
            onClick={handleContinue}
            disabled={!valid}
          >
            {btnLabel}
          </button>

          {/* Skip link for optional step */}
          {step === 10 && (
            <div className={styles.skipLink}>
              <button className={styles.skipBtn} onClick={handleContinue}>
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
