/**
 * 
  File: PROJECT-4/ai_flashcards/app/layout.js
 * RootLayout component for the AI Flashcards application.
 * 
 * @param {Object} props - The props object containing the children.
 * @returns {JSX.Element} The rendered RootLayout component.
 */


import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FlashGenius",
  description: "Create flashcards from your text",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
