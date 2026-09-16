import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export const metadata = {
  title: "Matchmaker | Onboarding",
  description: "Complete your intentional matchmaking profile.",
};

export default function OnboardingPage() {
  return (
    <main>
      <OnboardingWizard />
    </main>
  );
}
