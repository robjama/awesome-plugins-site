"use client";

import { Search, X, Filter } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/lib/types";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  totalPlugins: number;
  filteredCount: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  totalPlugins,
  filteredCount,
}: SearchBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearFilters = () => {
    onSearchChange("");
    onCategoryChange([]);
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0;

  return (
    <div className="bg-terminal-bgLight border border-terminal-border p-4 sticky top-4 z-10">
      {/* Search Input - Terminal Style */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-terminal-accent">
          <span>$</span>
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="grep -i 'search plugins' ..."
          className="w-full pl-14 pr-10 py-3 bg-terminal-bg border border-terminal-border text-terminal-text placeholder-terminal-textDim focus:outline-none focus:border-terminal-accent font-mono"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-textDim hover:text-terminal-error"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-terminal-text hover:text-terminal-accent font-medium"
        >
          <Filter className="w-4 h-4" />
          <span className="text-terminal-textDim">--filter-by</span>
          <span>categories</span>
          {selectedCategories.length > 0 && (
            <span className="bg-terminal-accent text-terminal-bg text-xs px-2 py-0.5 font-bold">
              {selectedCategories.length}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-terminal-textDim">
            [{filteredCount}/{totalPlugins}]
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-terminal-accent hover:text-terminal-accentDim font-medium"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-terminal-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <label
                  key={category}
                  className={`flex items-center gap-2 p-2 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-terminal-bg border-terminal-accent"
                      : "bg-terminal-bg border-terminal-border hover:border-terminal-textDim"
                  } border`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4"
                  />
                  <span
                    className={`text-sm font-mono ${
                      isSelected ? "text-terminal-accent font-bold" : "text-terminal-text"
                    }`}
                  >
                    [{isSelected ? 'x' : ' '}] {category}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
