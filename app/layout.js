import "./globals.css";

export const metadata = {
  title: "Arcline Labs — Precision infrastructure for frontier AI systems",
  description:
    "Arcline Labs builds verification, evaluation, and alignment infrastructure for production AI. Trusted by teams shipping models at scale.",
  keywords: "AI infrastructure, model evaluation, AI alignment, verification, frontier AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
