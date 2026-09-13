import ChatInterface from "@/components/onboarding/ChatInterface";

export const metadata = {
  title: "AI Interview | Matchmaker",
  description: "Chat with our AI concierge to discover your intentional matches.",
};

export default function OnboardingPage() {
  return (
    <main className="animate-fade-in">
      <ChatInterface />
    </main>
  );
}
