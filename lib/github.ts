import { Octokit } from "@octokit/rest";

const REPO_OWNER = "ccplugins";
const REPO_NAME = "awesome-claude-code-plugins";

// Initialize Octokit with optional GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: string;
  content?: string;
  encoding?: string;
}

// Helper to decode base64 content from GitHub API
function decodeContent(content: string): string {
  return Buffer.from(content, "base64").toString("utf-8");
}

export async function fetchMainReadme(): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: "README.md",
    });

    if (Array.isArray(data) || data.type !== "file") {
      throw new Error("README.md not found or is not a file");
    }

    return decodeContent(data.content!);
  } catch (error) {
    console.error("Error fetching main README:", error);
    throw error;
  }
}

export async function fetchPluginReadme(pluginName: string): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `plugins/${pluginName}/README.md`,
    });

    if (Array.isArray(data) || data.type !== "file") {
      return "";
    }

    return decodeContent(data.content!);
  } catch (error) {
    console.log(`No README found for plugin: ${pluginName}`);
    return "";
  }
}

export async function fetchDirectoryContents(
  path: string
): Promise<GitHubContent[]> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });

    if (!Array.isArray(data)) {
      return [];
    }

    return data as GitHubContent[];
  } catch (error) {
    console.log(`Directory not found: ${path}`);
    return [];
  }
}

export async function fetchFileContent(path: string): Promise<string> {
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
    });

    if (Array.isArray(data) || data.type !== "file") {
      return "";
    }

    return decodeContent(data.content!);
  } catch (error) {
    console.log(`File not found: ${path}`);
    return "";
  }
}

export async function fetchAgentFiles(pluginName: string) {
  const agentsPath = `plugins/${pluginName}/agents`;
  const contents = await fetchDirectoryContents(agentsPath);

  const agentFiles = contents.filter(
    (file) => file.type === "file" && file.name.endsWith(".md")
  );

  const agents = await Promise.all(
    agentFiles.map(async (file) => {
      const content = await fetchFileContent(file.path);
      return {
        fileName: file.name,
        content,
      };
    })
  );

  return agents;
}

export async function fetchCommandFiles(pluginName: string) {
  const commandsPath = `plugins/${pluginName}/commands`;
  const contents = await fetchDirectoryContents(commandsPath);

  const commandFiles = contents.filter(
    (file) => file.type === "file" && file.name.endsWith(".md")
  );

  const commands = await Promise.all(
    commandFiles.map(async (file) => {
      const content = await fetchFileContent(file.path);
      return {
        fileName: file.name,
        content,
      };
    })
  );

  return commands;
}
