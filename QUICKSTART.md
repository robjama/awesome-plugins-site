# Quick Start Guide

## What We've Built

A fully functional static Next.js site that creates a visual directory for the awesome-claude-code-plugins repository with:

- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🔍 Fuzzy search across 116+ plugins
- 🏷️ Multi-category filtering
- 📂 Expandable plugin cards with full details
- 📝 Agent prompts displayed in syntax-highlighted viewers
- 📋 One-click copy for installation commands
- ⚡ Fast, static site generation

## Current Status

The data fetching script is running and pulling plugin information from GitHub. You may see some 403/429 errors - this is normal without a GitHub token and the script handles it gracefully.

## Next Steps

### 1. (Optional) Add GitHub Token for Better Rate Limits

Without a token: 60 requests/hour
With a token: 5000 requests/hour

```bash
# Create a .env file
cp .env.example .env

# Add your GitHub token to .env
# Get one at: https://github.com/settings/tokens
# No special scopes needed for reading public repos
```

### 2. Run the Development Server

Once the data fetching completes:

```bash
cd ~/code/awesome-plugins-site
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
npm run build
```

This will:
- Automatically fetch fresh plugin data
- Build a static site in the `out/` directory
- Ready to deploy anywhere!

## Features to Try

1. **Search**: Try searching for "review" or "test" to find relevant plugins
2. **Filter**: Click "Categories" to filter by plugin type
3. **Expand**: Click "Show More" on any plugin to see:
   - Full README
   - All agent prompts with copy buttons
   - Installation instructions
4. **Install**: Click the copy button to grab the install command

## Deployment Options

The site is ready to deploy to:

- **Vercel** (recommended): One-click deploy, automatic rebuilds
- **Netlify**: Great alternative with similar features
- **GitHub Pages**: Free hosting for static sites
- **Any static hosting**: S3, Cloudflare Pages, etc.

## Project Structure

```
awesome-plugins-site/
├── app/
│   ├── page.tsx           # Main directory with search/filter
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Styles
├── components/
│   ├── PluginCard.tsx     # Individual plugin display
│   ├── SearchBar.tsx      # Search & filters
│   ├── PromptViewer.tsx   # Expandable prompts
│   └── InstallInstructions.tsx  # Copy-to-clipboard install
├── lib/
│   ├── github.ts          # GitHub API integration
│   ├── parse-plugins.ts   # Data transformation
│   └── types.ts           # TypeScript types
├── scripts/
│   └── fetch-plugins.ts   # Build-time data fetcher
└── data/
    └── plugins.json       # Generated plugin data
```

## Customization Ideas

- Change colors in `tailwind.config.ts`
- Add plugin popularity metrics
- Add "recently added" section
- Enable direct links to specific plugins
- Add community ratings

## Troubleshooting

**Data not showing?**
- Make sure `npm run fetch-data` completed successfully
- Check that `data/plugins.json` exists and has content

**Rate limit errors?**
- Add a GitHub token to `.env`
- The script pauses every 10 plugins to avoid limits

**Build errors?**
- Run `npm install` to ensure all dependencies are installed
- Check that you're using Node.js 18+

## Support

For issues or questions:
- Check the main README.md
- Review the implementation plan at: `~/.claude/plans/encapsulated-coalescing-owl.md`
