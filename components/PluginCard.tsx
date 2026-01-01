"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Package } from "lucide-react";
import type { Plugin } from "@/lib/types";
import PromptViewer from "./PromptViewer";
import InstallInstructions from "./InstallInstructions";

interface PluginCardProps {
  plugin: Plugin;
}

export default function PluginCard({ plugin }: PluginCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-terminal-bgLight border border-terminal-border hover:border-terminal-accent transition-colors">
      <div className="p-4">
        {/* Terminal-style header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Package className="w-4 h-4 text-terminal-accent mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-terminal-text break-words">
                {plugin.name}
              </h3>
              <span className="inline-block text-xs text-terminal-textDim mt-1">
                <span className="text-terminal-info">[{plugin.category}]</span>
              </span>
            </div>
          </div>
          <a
            href={plugin.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-textDim hover:text-terminal-accent transition-colors flex-shrink-0"
            title="View on GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Description */}
        <p className="text-sm text-terminal-text mt-3 line-clamp-2 pl-6">
          {plugin.description}
        </p>

        {/* Stats - Terminal style */}
        <div className="flex items-center gap-4 mt-3 text-xs text-terminal-textDim pl-6">
          {plugin.agents.length > 0 && (
            <span className="text-terminal-accent">
              ● {plugin.agents.length} agent{plugin.agents.length !== 1 ? 's' : ''}
            </span>
          )}
          {plugin.commands.length > 0 && (
            <span className="text-terminal-info">
              ▸ {plugin.commands.length} command{plugin.commands.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-terminal-bg hover:bg-terminal-border text-terminal-accent border border-terminal-border hover:border-terminal-accent transition-colors text-sm font-medium"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              collapse
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              expand --details
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-terminal-border p-4 bg-terminal-bg">
          {/* Full README */}
          {plugin.readme && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-terminal-accent mb-2 flex items-center gap-2">
                <span className="text-terminal-textDim">$</span> cat README.md
              </h4>
              <div className="bg-terminal-bgLight p-4 border border-terminal-border">
                <div className="whitespace-pre-wrap text-sm text-terminal-text">
                  {plugin.readme}
                </div>
              </div>
            </div>
          )}

          {/* Agents */}
          <PromptViewer agents={plugin.agents} />

          {/* Commands */}
          {plugin.commands.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-terminal-accent mb-2 flex items-center gap-2">
                <span className="text-terminal-textDim">$</span> ls commands/
                <span className="text-terminal-textDim">({plugin.commands.length})</span>
              </h4>
              <div className="space-y-2">
                {plugin.commands.map((command) => (
                  <div
                    key={command.name}
                    className="p-3 bg-terminal-bgLight border border-terminal-border"
                  >
                    <div className="font-mono text-sm text-terminal-accent">
                      ▸ {command.name}
                    </div>
                    <div className="text-sm text-terminal-text mt-1 pl-4">
                      {command.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Installation */}
          <InstallInstructions installCommand={plugin.installCommand} />
        </div>
      )}
    </div>
  );
}
