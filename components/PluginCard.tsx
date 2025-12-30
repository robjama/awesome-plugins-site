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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 bg-claude-100 rounded-lg flex-shrink-0">
              <Package className="w-5 h-5 text-claude-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 break-words">
                {plugin.name}
              </h3>
              <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mt-1">
                {plugin.category}
              </span>
            </div>
          </div>
          <a
            href={plugin.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
            title="View on GitHub"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3 line-clamp-2">
          {plugin.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          {plugin.agents.length > 0 && (
            <span>{plugin.agents.length} agent{plugin.agents.length !== 1 ? 's' : ''}</span>
          )}
          {plugin.commands.length > 0 && (
            <span>{plugin.commands.length} command{plugin.commands.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          {isExpanded ? (
            <>
              Show Less
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show More
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 animate-fade-in">
          {/* Full README */}
          {plugin.readme && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Documentation
              </h4>
              <div className="prose prose-sm max-w-none bg-white p-4 rounded-lg border border-gray-200">
                <div className="whitespace-pre-wrap text-sm text-gray-700">
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
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Commands ({plugin.commands.length})
              </h4>
              <div className="space-y-2">
                {plugin.commands.map((command) => (
                  <div
                    key={command.name}
                    className="p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="font-mono text-sm text-gray-900">
                      {command.name}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
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
