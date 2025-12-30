import matter from "gray-matter";
import { Plugin, Agent, Command, CATEGORIES } from "./types";

interface PluginListItem {
  name: string;
  category: string;
}

// Parse the main README to extract plugin names and their categories
export function parseMainReadme(readmeContent: string): PluginListItem[] {
  const plugins: PluginListItem[] = [];
  const lines = readmeContent.split("\n");

  let currentCategory = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line is a category heading (### Category Name)
    if (line.startsWith("### ") && !line.includes("Contributing") && !line.includes("License")) {
      const categoryName = line.replace("### ", "").trim();
      // Only set as current category if it matches one of our known categories
      if (CATEGORIES.includes(categoryName as any)) {
        currentCategory = categoryName;
      }
    }

    // Check if line is a plugin link (- [plugin-name](./plugins/plugin-name))
    const pluginMatch = line.match(/^-\s*\[([^\]]+)\]\(\.\/plugins\/([^)"]+)/);
    if (pluginMatch && currentCategory) {
      const [, displayName, path] = pluginMatch;
      plugins.push({
        name: path,
        category: currentCategory,
      });
    }
  }

  return plugins;
}

// Extract description from plugin README
export function extractPluginDescription(readmeContent: string): string {
  if (!readmeContent) return "";

  const lines = readmeContent.split("\n");

  // Skip the title and find the first substantial paragraph
  let foundTitle = false;
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip the main title
    if (trimmed.startsWith("#")) {
      foundTitle = true;
      continue;
    }

    // Return the first non-empty line after the title
    if (foundTitle && trimmed && !trimmed.startsWith("#")) {
      return trimmed;
    }
  }

  return "No description available";
}

// Parse agent file content
export function parseAgentFile(fileName: string, content: string): Agent {
  let frontmatter: any = {};
  let markdownContent = content;

  try {
    const parsed = matter(content);
    frontmatter = parsed.data;
    markdownContent = parsed.content;
  } catch (error) {
    // If frontmatter parsing fails, treat entire content as markdown
    console.log(`Note: Could not parse frontmatter for ${fileName}, using entire content`);
  }

  // Extract name from filename (remove .md extension)
  const name = fileName.replace(".md", "");

  // Try to extract metadata from frontmatter or content
  const agent: Agent = {
    name: frontmatter.name || name,
    description: frontmatter.description || extractAgentDescription(markdownContent),
    prompt: markdownContent,
    model: frontmatter.model,
    color: frontmatter.color,
    fileName,
  };

  return agent;
}

// Extract description from agent content
function extractAgentDescription(content: string): string {
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip headings and empty lines
    if (trimmed && !trimmed.startsWith("#")) {
      return trimmed.length > 200 ? trimmed.substring(0, 200) + "..." : trimmed;
    }
  }

  return "Agent definition";
}

// Parse command file content
export function parseCommandFile(fileName: string, content: string): Command {
  let frontmatter: any = {};
  let markdownContent = content;

  try {
    const parsed = matter(content);
    frontmatter = parsed.data;
    markdownContent = parsed.content;
  } catch (error) {
    // If frontmatter parsing fails, treat entire content as markdown
    console.log(`Note: Could not parse frontmatter for command ${fileName}, using entire content`);
  }

  const name = fileName.replace(".md", "");

  return {
    name: frontmatter.name || name,
    description: frontmatter.description || extractCommandDescription(markdownContent),
    fileName,
  };
}

// Extract description from command content
function extractCommandDescription(content: string): string {
  const lines = content.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      return trimmed.length > 200 ? trimmed.substring(0, 200) + "..." : trimmed;
    }
  }

  return "Command definition";
}

// Build complete plugin object
export function buildPlugin(
  pluginListItem: PluginListItem,
  readmeContent: string,
  agentFiles: { fileName: string; content: string }[],
  commandFiles: { fileName: string; content: string }[]
): Plugin {
  const agents = agentFiles.map((file) =>
    parseAgentFile(file.fileName, file.content)
  );

  const commands = commandFiles.map((file) =>
    parseCommandFile(file.fileName, file.content)
  );

  return {
    id: pluginListItem.name,
    name: pluginListItem.name,
    category: pluginListItem.category,
    description: extractPluginDescription(readmeContent),
    readme: readmeContent,
    agents,
    commands,
    installCommand: `/plugin install github.com/ccplugins/awesome-claude-code-plugins/plugins/${pluginListItem.name}`,
    githubUrl: `https://github.com/ccplugins/awesome-claude-code-plugins/tree/main/plugins/${pluginListItem.name}`,
  };
}
