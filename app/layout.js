import "./globals.css";

export const metadata = {
  title: "Matchmaker | AI-Powered Intentional Dating",
  description:
    "Stop swiping. Start connecting. Our AI gets to know the real you and curates one perfect match at a time.",
  keywords: "dating, AI matchmaking, intentional dating, compatibility, relationships",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
