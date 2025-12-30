import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import {
  fetchMainReadme,
  fetchPluginReadme,
  fetchAgentFiles,
  fetchCommandFiles,
} from "../lib/github";
import { parseMainReadme, buildPlugin } from "../lib/parse-plugins";

async function main() {
  console.log("🚀 Fetching plugin data from GitHub...");

  try {
    // Step 1: Fetch and parse main README
    console.log("📄 Fetching main README...");
    const mainReadme = await fetchMainReadme();
    const pluginList = parseMainReadme(mainReadme);
    console.log(`✅ Found ${pluginList.length} plugins across categories`);

    // Step 2: Fetch detailed info for each plugin
    console.log("📦 Fetching plugin details...");
    const plugins = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < pluginList.length; i++) {
      const pluginItem = pluginList[i];
      console.log(
        `[${i + 1}/${pluginList.length}] Fetching ${pluginItem.name}...`
      );

      try {
        const [readme, agentFiles, commandFiles] = await Promise.all([
          fetchPluginReadme(pluginItem.name),
          fetchAgentFiles(pluginItem.name),
          fetchCommandFiles(pluginItem.name),
        ]);

        const plugin = buildPlugin(pluginItem, readme, agentFiles, commandFiles);
        plugins.push(plugin);
        successCount++;

        console.log(
          `  ✓ ${plugin.name}: ${plugin.agents.length} agents, ${plugin.commands.length} commands`
        );
      } catch (error) {
        console.error(`  ✗ Error fetching ${pluginItem.name}:`, error);
        errorCount++;
      }

      // Add a small delay to avoid rate limiting
      if ((i + 1) % 10 === 0) {
        console.log("⏸️  Pausing briefly to avoid rate limits...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n✅ Successfully fetched ${successCount} plugins`);
    if (errorCount > 0) {
      console.log(`⚠️  Failed to fetch ${errorCount} plugins`);
    }

    // Step 3: Save to JSON file
    console.log("\n💾 Saving plugin data...");
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });

    const outputPath = path.join(dataDir, "plugins.json");
    await fs.writeFile(outputPath, JSON.stringify(plugins, null, 2), "utf-8");

    console.log(`✅ Plugin data saved to ${outputPath}`);
    console.log(`📊 Total plugins: ${plugins.length}`);

    // Print category breakdown
    const categoryCounts = plugins.reduce((acc, plugin) => {
      acc[plugin.category] = (acc[plugin.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\n📂 Plugins by category:");
    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });

    console.log("\n🎉 Done!");
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

main();
