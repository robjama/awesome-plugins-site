"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import PluginCard from "@/components/PluginCard";
import SearchBar from "@/components/SearchBar";
import { Plugin, CATEGORIES } from "@/lib/types";
import { Terminal, AlertCircle } from "lucide-react";

// Import the plugins data - this will be generated at build time
let pluginsData: Plugin[] = [];
try {
  pluginsData = require("@/data/plugins.json");
} catch (error) {
  console.log("Plugin data not yet generated. Run 'npm run fetch-data' first.");
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(pluginsData, {
        keys: [
          { name: "name", weight: 2 },
          { name: "description", weight: 1.5 },
          { name: "readme", weight: 1 },
          { name: "agents.name", weight: 1 },
          { name: "agents.description", weight: 1 },
          { name: "agents.prompt", weight: 0.5 },
        ],
        threshold: 0.3,
        includeScore: true,
      }),
    []
  );

  // Filter and search plugins
  const filteredPlugins = useMemo(() => {
    let results = pluginsData;

    // Apply search query
    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      results = fuseResults.map((result) => result.item);
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter((plugin) =>
        selectedCategories.includes(plugin.category)
      );
    }

    return results;
  }, [searchQuery, selectedCategories, fuse]);

  // Group plugins by category
  const pluginsByCategory = useMemo(() => {
    const grouped: Record<string, Plugin[]> = {};

    CATEGORIES.forEach((category) => {
      grouped[category] = [];
    });

    filteredPlugins.forEach((plugin) => {
      if (grouped[plugin.category]) {
        grouped[plugin.category].push(plugin);
      }
    });

    // Remove empty categories
    return Object.entries(grouped).filter(([_, plugins]) => plugins.length > 0);
  }, [filteredPlugins]);

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Terminal Header */}
      <header className="border-b border-terminal-border bg-terminal-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Terminal window controls */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-terminal-error"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-warning"></div>
            <div className="w-3 h-3 rounded-full bg-terminal-accent"></div>
            <span className="ml-4 text-terminal-textDim text-sm">
              awesome-claude-code-plugins ~ terminal
            </span>
          </div>

          {/* ASCII art header */}
          <div className="text-terminal-accent terminal-glow mb-4">
            <pre className="text-xs sm:text-sm leading-tight">
{`╔═══════════════════════════════════════════════════════════════╗
║  █████╗ ██╗    ██╗███████╗███████╗ ██████╗ ███╗   ███╗███████╗║
║ ██╔══██╗██║    ██║██╔════╝██╔════╝██╔═══██╗████╗ ████║██╔════╝║
║ ███████║██║ █╗ ██║█████╗  ███████╗██║   ██║██╔████╔██║█████╗  ║
║ ██╔══██║██║███╗██║██╔══╝  ╚════██║██║   ██║██║╚██╔╝██║██╔══╝  ║
║ ██║  ██║╚███╔███╔╝███████╗███████║╚██████╔╝██║ ╚═╝ ██║███████╗║
║ ╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝║
╚═══════════════════════════════════════════════════════════════╝`}
            </pre>
          </div>

          <div className="flex items-start gap-2 text-terminal-text">
            <Terminal className="w-5 h-5 mt-1 text-terminal-accent" />
            <div>
              <p className="text-sm text-terminal-textDim">
                <span className="text-terminal-accent">user@claude-plugins</span>
                <span className="text-terminal-textDim">:</span>
                <span className="text-terminal-info">~/directory</span>
                <span className="text-terminal-textDim">$</span>
                <span className="ml-2">ls -la --plugins</span>
              </p>
              <p className="text-xs text-terminal-textDim mt-2">
                Browse {pluginsData.length} Claude Code plugins • Search by name, description, or prompt content
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          totalPlugins={pluginsData.length}
          filteredCount={filteredPlugins.length}
        />

        {/* Empty State */}
        {pluginsData.length === 0 && (
          <div className="mt-12 text-center border border-terminal-border bg-terminal-bgLight p-8 rounded">
            <AlertCircle className="w-12 h-12 text-terminal-warning mx-auto mb-4" />
            <p className="text-terminal-text mb-2">
              <span className="text-terminal-error">Error:</span> No plugin data found
            </p>
            <p className="text-terminal-textDim text-sm mb-4">
              Run <code className="bg-terminal-bg px-2 py-1 text-terminal-accent">npm run fetch-data</code> to fetch plugin information from GitHub
            </p>
          </div>
        )}

        {/* No Results */}
        {pluginsData.length > 0 && filteredPlugins.length === 0 && (
          <div className="mt-12 text-center border border-terminal-border bg-terminal-bgLight p-8 rounded">
            <p className="text-terminal-textDim mb-2">
              <span className="text-terminal-accent">$</span> grep -r "{searchQuery || 'filtered'}" ./plugins
            </p>
            <p className="text-terminal-error">
              grep: no matches found
            </p>
            <p className="text-terminal-textDim text-sm mt-4">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Plugin Grid by Category */}
        {pluginsByCategory.map(([category, plugins]) => (
          <div key={category} className="mt-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-terminal-border">
              <span className="text-terminal-accent">╭─</span>
              <h2 className="text-lg font-bold text-terminal-text flex items-center gap-2">
                {category}
                <span className="text-sm font-normal text-terminal-textDim">
                  ({plugins.length} {plugins.length === 1 ? 'plugin' : 'plugins'})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-4">
              {plugins.map((plugin) => (
                <PluginCard key={plugin.id} plugin={plugin} />
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-terminal-border bg-terminal-bgLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-terminal-textDim text-sm">
            <p className="mb-2">
              <span className="text-terminal-accent">$</span> cat README.md
            </p>
            <p className="ml-4">
              Built for the{" "}
              <a
                href="https://github.com/ccplugins/awesome-claude-code-plugins"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent hover:text-terminal-accentDim underline"
              >
                Claude Code community
              </a>
            </p>
            <p className="ml-4 mt-2 text-xs">
              <span className="text-terminal-info">INFO:</span> Terminal UI inspired by{" "}
              <a
                href="https://ghostty.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-accent hover:text-terminal-accentDim underline"
              >
                Ghostty
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
