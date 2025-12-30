import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Awesome Claude Code Plugins",
  description: "A comprehensive directory of Claude Code plugins with detailed information and prompts",
  keywords: ["Claude", "Claude Code", "plugins", "AI", "developer tools"],
  authors: [{ name: "Claude Code Community" }],
  openGraph: {
    title: "Awesome Claude Code Plugins",
    description: "Browse, search, and discover Claude Code plugins",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
