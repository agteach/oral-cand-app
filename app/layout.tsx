import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oral Candidiasis App",
  description: "Patient management for oral candidiasis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}