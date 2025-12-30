"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import PluginCard from "@/components/PluginCard";
import SearchBar from "@/components/SearchBar";
import { Plugin, CATEGORIES } from "@/lib/types";
import { Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-claude-400 to-claude-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Awesome Claude Code Plugins
              </h1>
              <p className="text-gray-600 mt-1">
                Discover, explore, and install Claude Code plugins
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
          <div className="mt-12 text-center">
            <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
              <Sparkles className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No plugin data found
            </h2>
            <p className="text-gray-600 mb-4">
              Run <code className="bg-gray-100 px-2 py-1 rounded">npm run fetch-data</code> to fetch plugin information from GitHub
            </p>
          </div>
        )}

        {/* No Results */}
        {pluginsData.length > 0 && filteredPlugins.length === 0 && (
          <div className="mt-12 text-center">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No plugins found
            </h2>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Plugin Grid by Category */}
        {pluginsByCategory.map(([category, plugins]) => (
          <div key={category} className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {category}
              <span className="text-sm font-normal text-gray-500">
                ({plugins.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plugins.map((plugin) => (
                <PluginCard key={plugin.id} plugin={plugin} />
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>
            Built with ❤️ for the{" "}
            <a
              href="https://github.com/ccplugins/awesome-claude-code-plugins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-claude-600 hover:text-claude-700 font-medium"
            >
              Claude Code community
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Import Search icon
import { Search } from "lucide-react";
