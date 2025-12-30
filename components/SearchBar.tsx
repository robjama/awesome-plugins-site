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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4 z-10">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search plugins, descriptions, or prompts..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-claude-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
        >
          <Filter className="w-4 h-4" />
          Categories
          {selectedCategories.length > 0 && (
            <span className="bg-claude-500 text-white text-xs px-2 py-0.5 rounded-full">
              {selectedCategories.length}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {filteredCount} of {totalPlugins} plugins
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-claude-600 hover:text-claude-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <label
                  key={category}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-claude-100 border-claude-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  } border`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 text-claude-600 border-gray-300 rounded focus:ring-claude-500"
                  />
                  <span
                    className={`text-sm ${
                      isSelected ? "text-claude-900 font-medium" : "text-gray-700"
                    }`}
                  >
                    {category}
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
