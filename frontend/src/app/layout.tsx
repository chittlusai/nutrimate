import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "NutriMate - AI Nutrition Tracker",
  description: "Track your nutrition with AI-powered food recognition. Snap a photo and get instant nutrition insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
