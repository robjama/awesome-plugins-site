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
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Agents ({agents.length})
      </h4>
      <div className="space-y-2">
        {agents.map((agent) => {
          const isExpanded = expandedAgents.has(agent.name);
          const isCopied = copiedAgent === agent.name;

          return (
            <div
              key={agent.name}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleAgent(agent.name)}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">
                        {agent.name}
                      </span>
                      {agent.model && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
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
                    <p className="text-sm text-gray-600 truncate">
                      {agent.description}
                    </p>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-xs font-medium text-gray-700">
                      Prompt
                    </h5>
                    <button
                      onClick={() => copyPrompt(agent.name, agent.prompt)}
                      className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-white border border-gray-200 p-3 rounded-md text-xs overflow-x-auto whitespace-pre-wrap break-words">
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
