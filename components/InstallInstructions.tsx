"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface InstallInstructionsProps {
  installCommand: string;
}

export default function InstallInstructions({ installCommand }: InstallInstructionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-terminal-accent mb-2 flex items-center gap-2">
        <span className="text-terminal-textDim">$</span> Installation
      </h4>
      <div className="relative group">
        <div className="bg-terminal-bg border border-terminal-accent p-4">
          <div className="flex items-start gap-2">
            <span className="text-terminal-accent select-none">$</span>
            <pre className="text-terminal-text text-sm overflow-x-auto flex-1">
              <code>{installCommand}</code>
            </pre>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-terminal-bgLight hover:bg-terminal-border border border-terminal-border text-terminal-accent transition-colors opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      <p className="text-xs text-terminal-textDim mt-2 pl-6">
        <span className="text-terminal-info">TIP:</span> Copy and paste this command into Claude Code
      </p>
    </div>
  );
}
