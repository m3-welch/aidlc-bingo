import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-DLC Bingo",
  description: "Bingo for your AI-DLC mob sessions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
