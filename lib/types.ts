export interface Agent {
  name: string;
  description: string;
  prompt: string;
  model?: string;
  color?: string;
  fileName?: string;
}

export interface Command {
  name: string;
  description: string;
  fileName?: string;
}

export interface Plugin {
  id: string;
  name: string;
  category: string;
  description: string;
  readme: string;
  agents: Agent[];
  commands: Command[];
  installCommand: string;
  githubUrl: string;
}

export interface Category {
  name: string;
  plugins: Plugin[];
}

export const CATEGORIES = [
  "Official Claude Code Plugins",
  "Workflow Orchestration",
  "Automation DevOps",
  "Business Sales",
  "Code Quality Testing",
  "Data Analytics",
  "Design UX",
  "Development Engineering",
  "Documentation",
  "Git Workflow",
  "Marketing Growth",
  "Project & Product Management",
  "Security, Compliance, & Legal",
] as const;

export type CategoryName = typeof CATEGORIES[number];
