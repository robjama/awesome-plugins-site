"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import type { Agent } from "@/lib/types";

interface PromptViewerProps {
  agents: Agent[];
}

export default function PromptViewer({ agents }: PromptViewerProps) {
  const [expandedAgents, setExpandedAgents] = useState<Set<string>>(new Set());
  const [copiedAgent, setCopiedAgent] = useState<string | null>(null);

  const toggleAgent = (agentName: string) => {
    const newExpanded = new Set(expandedAgents);
    if (newExpanded.has(agentName)) {
      newExpanded.delete(agentName);
    } else {
      newExpanded.add(agentName);
    }
    setExpandedAgents(newExpanded);
  };

  const copyPrompt = async (agentName: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopiedAgent(agentName);
    setTimeout(() => setCopiedAgent(null), 2000);
  };

  if (agents.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-terminal-accent mb-2 flex items-center gap-2">
        <span className="text-terminal-textDim">$</span> cat agents/
        <span className="text-terminal-textDim">({agents.length})</span>
      </h4>
      <div className="space-y-2">
        {agents.map((agent) => {
          const isExpanded = expandedAgents.has(agent.name);
          const isCopied = copiedAgent === agent.name;

          return (
            <div
              key={agent.name}
              className="border border-terminal-border overflow-hidden"
            >
              <button
                onClick={() => toggleAgent(agent.name)}
                className="w-full flex items-center justify-between p-3 bg-terminal-bgLight hover:bg-terminal-bg transition-colors text-left"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-terminal-accent flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-terminal-accent flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-terminal-text">
                        {agent.name}
                      </span>
                      {agent.model && (
                        <span className="text-xs bg-terminal-bg text-terminal-info px-2 py-0.5 border border-terminal-border">
                          {agent.model}
                        </span>
                      )}
                      {agent.color && (
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: agent.color.toLowerCase() }}
                          title={agent.color}
                        />
                      )}
                    </div>
                    <p className="text-sm text-terminal-textDim truncate">
                      {agent.description}
                    </p>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-terminal-border bg-terminal-bg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-medium text-terminal-textDim">
                      <span className="text-terminal-accent">$</span> cat {agent.fileName || `${agent.name}.md`}
                    </h5>
                    <button
                      onClick={() => copyPrompt(agent.name, agent.prompt)}
                      className="flex items-center gap-1 text-xs text-terminal-textDim hover:text-terminal-accent transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-terminal-accent" />
                          <span className="text-terminal-accent">copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-terminal-bgLight border border-terminal-border p-3 text-xs overflow-x-auto whitespace-pre-wrap break-words text-terminal-text">
                    <code>{agent.prompt}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
