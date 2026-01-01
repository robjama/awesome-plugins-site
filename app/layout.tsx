import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "awesome-claude-code-plugins ~ terminal",
  description: "A comprehensive directory of Claude Code plugins with detailed information and prompts",
  keywords: ["Claude", "Claude Code", "plugins", "AI", "developer tools", "terminal"],
  authors: [{ name: "Claude Code Community" }],
  openGraph: {
    title: "Awesome Claude Code Plugins - Terminal Directory",
    description: "Browse, search, and discover Claude Code plugins in a terminal-style interface",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-terminal-bg">
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
