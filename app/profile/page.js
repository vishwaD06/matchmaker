"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import ProfileCard from "@/components/profile/ProfileCard";
import Button from "@/components/ui/Button";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedProfile = sessionStorage.getItem("matchmaker_profile");
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error("Failed to parse profile");
      }
    } else {
      // If no profile, mock one for dev purposes if on this page directly
      // In production, we'd probably redirect to onboarding
      setProfile({
        name: "Alex",
        bio: "Alex is a thoughtful adventurer who values deep connections and authentic conversations. They balance a high-energy outdoor lifestyle with quiet evenings reading, looking for someone who appreciates both.",
        traits: {
          openness: 85,
          conscientiousness: 70,
          extraversion: 60,
          agreeableness: 80,
          emotional_stability: 75
        },
        values: ["Authenticity", "Personal Growth", "Empathy", "Adventure"],
        lifestyle: ["Active", "Early bird", "Foodie", "Dog lover"],
        relationship_style: "Seeks an egalitarian partnership based on mutual respect and shared growth.",
        communication_style: "Direct but gentle. Prefers talking things out face-to-face.",
        looking_for: "Someone who is kind, intellectually curious, and ready for a committed relationship.",
        deal_breakers: ["Inconsistency", "Lack of curiosity"]
      });
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <main>
      <Navbar />
      <div className="section" style={{ paddingTop: "120px", minHeight: "100vh" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 className="heading-lg mb-4">Your Profile is <span className="gradient-text">Ready</span></h1>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              We've mapped your personality and relationship needs. We'll use this to find your perfect match.
            </p>
          </div>
          
          <ProfileCard profile={profile} />
          
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <Button variant="primary" onClick={() => alert("Matching engine coming soon in Phase 2!")}>
              Find My Match
            </Button>
            <p className="text-secondary text-sm mt-4">
              (This will trigger the vector similarity search in the next phase)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
