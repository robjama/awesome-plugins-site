# Awesome Claude Code Plugins - Visual Directory

A beautiful, searchable directory for browsing Claude Code plugins. This static Next.js site fetches plugin data from the [awesome-claude-code-plugins](https://github.com/ccplugins/awesome-claude-code-plugins) repository and presents it in an easy-to-navigate interface.

## Features

- **Visual Plugin Cards**: Browse plugins with clean, organized cards
- **Advanced Search**: Fuzzy search across plugin names, descriptions, and prompts
- **Category Filtering**: Filter plugins by multiple categories
- **Expandable Details**: View full README content, agent prompts, and commands
- **One-Click Install**: Copy installation commands with a single click
- **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- **Static Site**: Fast loading with no runtime API calls

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) GitHub Personal Access Token for higher API rate limits

### Installation

1. Clone this repository:
```bash
git clone <your-repo-url>
cd awesome-plugins-site
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file with your GitHub token:
```bash
cp .env.example .env
# Edit .env and add your GitHub token
```

### Fetch Plugin Data

Before building or running the site, fetch the plugin data from GitHub:

```bash
npm run fetch-data
```

This will:
- Fetch the main README from awesome-claude-code-plugins
- Parse all plugin names and categories
- Fetch detailed information for each plugin (README, agents, commands)
- Save everything to `data/plugins.json`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

Build the static site:

```bash
npm run build
```

The build process will:
1. Automatically run `fetch-data` to get the latest plugin information
2. Generate a static site in the `out/` directory

Preview the production build:

```bash
npm run start
```

## Deployment

This site is configured for static export and can be deployed to:

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add `GITHUB_TOKEN` environment variable (optional)
4. Deploy!

Vercel will automatically run the build script which fetches fresh data.

### Netlify

1. Push your code to GitHub
2. Connect your repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `out`
5. Add `GITHUB_TOKEN` environment variable (optional)
6. Deploy!

### GitHub Pages

1. Build the site: `npm run build`
2. Push the `out/` directory to your `gh-pages` branch
3. Enable GitHub Pages in repository settings

## Project Structure

```
awesome-plugins-site/
├── app/
│   ├── page.tsx          # Main directory page with search/filter
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   ├── PluginCard.tsx    # Individual plugin card
│   ├── SearchBar.tsx     # Search and category filters
│   ├── PromptViewer.tsx  # Expandable agent prompts
│   └── InstallInstructions.tsx  # Installation code snippet
├── lib/
│   ├── github.ts         # GitHub API client
│   ├── parse-plugins.ts  # Plugin data parser
│   └── types.ts          # TypeScript interfaces
├── scripts/
│   └── fetch-plugins.ts  # Build-time data fetching
└── data/
    └── plugins.json      # Generated plugin data
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes data fetch)
- `npm run start` - Preview production build
- `npm run fetch-data` - Manually fetch plugin data
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Fuse.js** - Fuzzy search
- **Octokit** - GitHub API client
- **gray-matter** - Markdown frontmatter parsing
- **lucide-react** - Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgements

Built for the [Claude Code community](https://github.com/ccplugins/awesome-claude-code-plugins)
