import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Path to keep prompts persistent in server workspace
  const DATA_FILE = path.join(process.cwd(), "prompts-data.json");

  // Load initial prompts or empty array
  let promptsList: any[] = [];
  try {
    if (fs.existsSync(DATA_FILE)) {
      promptsList = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } else {
      promptsList = [];
      fs.writeFileSync(DATA_FILE, JSON.stringify(promptsList, null, 2));
    }
  } catch (error) {
    console.error("Error reading prompts data file", error);
  }

  // Auto-seed nearly 300 stunning viral AI Wallpapers if not present
  const wallpaperCount = promptsList.filter(p => p.category === "AI Wallpapers").length;
  if (wallpaperCount < 280) {
    console.log(`Seeding AI Wallpapers... Current count: ${wallpaperCount}`);
    
    // Remove any incomplete or old AI Wallpapers
    promptsList = promptsList.filter(p => p.category !== "AI Wallpapers");

    const themes = [
      {
        name: "Cosmic Neon Horizon",
        tags: ["cosmic", "neon", "galaxy", "stellar", "space"],
        ids: [
          "photo-1419242902214-272b3f66ee7a", "photo-1518531933037-91b2f5f229cc", "photo-1519681393784-d120267933ba",
          "photo-1446776811953-b23d57bd21aa", "photo-1506318137071-a8e063b4bec0", "photo-1541701494587-cb58502866ab",
          "photo-1451187580459-43490279c0fa", "photo-1502134249126-9f3755a50d78", "photo-1538370965046-79c0d6907d47"
        ]
      },
      {
        name: "Cyberpunk Terminal Rain",
        tags: ["cyberpunk", "neon", "rain", "street", "city"],
        ids: [
          "photo-1525547719571-a2d4ac8945e2", "photo-1504384308090-c894fdcc538d", "photo-1542831371-29b0f74f9713",
          "photo-1515621061946-eff1c2a352bd", "photo-1618843479313-40f8afb4b4d8", "photo-1617531653332-bd46c24f2068",
          "photo-1509198397868-475647b2a1e5", "photo-1511512578047-dfb367046420", "photo-1511512578047-dfb367332145"
        ]
      },
      {
        name: "Zen Minimalist Dunes",
        tags: ["zen", "minimal", "peace", "abstract", "pastel"],
        ids: [
          "photo-1507525428034-b723cf961d3e", "photo-1533090161767-e6ffed986c88", "photo-1528459801416-a9e53bbf4e17",
          "photo-1501854140801-50d01698950b", "photo-1540206351-d6465b3ac5c1", "photo-1509316975850-ff9c5edd0cd9",
          "photo-1504851149312-7a075b496cc7", "photo-1518156677180-95a2893f3e9f", "photo-1500485035595-cbeaf2741630"
        ]
      },
      {
        name: "Mystical Emerald Forest",
        tags: ["forest", "nature", "myth", "foliage", "trees"],
        ids: [
          "photo-1447752875215-b2761acb3c5d", "photo-1441974231531-c6227db76b6e", "photo-1469474968028-56623f02e42e",
          "photo-1513836279014-a89f7a76ae86", "photo-1473448912268-2022ce9509d8", "photo-1502082553048-f009c37129b9",
          "photo-1518531933555-d3d5fdcc558d", "photo-1511497584788-876760111969", "photo-1511497584788-876760111970"
        ]
      },
      {
        name: "Retro Synthwave Grid",
        tags: ["retro", "synthwave", "vaporwave", "sunset", "90s"],
        ids: [
          "photo-1557683316-973673baf926", "photo-1563089145-599997674d42", "photo-1579546929518-9e396f3cc809",
          "photo-1618005182384-a83a8bd57fbe", "photo-1550684848-fac1c5b4e853", "photo-1554080353-a576cf803bda",
          "photo-1601042879364-f3947d3f9c16", "photo-1561070791-2526d30994b5", "photo-1561070791-2526d30994b6"
        ]
      },
      {
        name: "Ethereal Magical Sky",
        tags: ["dreamy", "magic", "pastel", "clouds", "airway"],
        ids: [
          "photo-1483728642387-6c3bdd6c93e5", "photo-1518709268805-4e9042af9f23", "photo-1494790108377-be9c29b29330",
          "photo-1517582080012-f24e2ec5ad92", "photo-1532980400857-e8d9d2757f58", "photo-1516339901601-2e1d62dc0c45",
          "photo-1520690214124-2405c5217036", "photo-1502790371629-27b4b3aa3453", "photo-1502790371629-27b4b3aa3454"
        ]
      },
      {
        name: "Abstract Fluid Aura",
        tags: ["ink", "fluid", "abstract", "art", "psych"],
        ids: [
          "photo-1541701494587-cb58502866ab", "photo-1618005182384-a83a8bd57fbe", "photo-1528459801416-a9e53bbf4e17",
          "photo-1554080353-a576cf803bda", "photo-1579783900882-c0d3dad7b119", "photo-1550684848-fac1c5b4e853",
          "photo-1541625602330-2277a4c46182", "photo-1550537687-c91072c4792d", "photo-1550537687-c91072c4792e"
        ]
      },
      {
        name: "Epic Flame Samurai",
        tags: ["samurai", "anime", "action", "epic", "combat"],
        ids: [
          "photo-1548102245-c7bf7c569ff4", "photo-1509114397022-ed747cca3f65", "photo-1600585154340-be6161a56a0c",
          "photo-1486915309851-b0cc1f8a0084", "photo-1534447677768-be436bb09401", "photo-1518709268805-4e9042af9f23",
          "photo-1578632767115-351597cf2477", "photo-1509114397022-ed747cca3f66", "photo-1509114397022-ed747cca3f67"
        ]
      },
      {
        name: "Luxury Elite Lifestyle",
        tags: ["luxury", "car", "yacht", "rich", "mansion"],
        ids: [
          "photo-1525609004556-c46c7d6cf0a3", "photo-1567899378494-47b22a2ae96a", "photo-1546182990-dffeafbe841d",
          "photo-1540962351504-03099e0a754b", "photo-1614162692292-7ac56d7f7f1e", "photo-1600585154340-be6161a56a0c",
          "photo-1512917774080-9991f1c4c750", "photo-1505691938895-1758d7feb511", "photo-1505691938895-1758d7feb512"
        ]
      }
    ];

    const seededWallpapers: any[] = [];
    const totalTarget = 295; // Nearly 300 wallpapers!

    for (let i = 1; i <= totalTarget; i++) {
      const theme = themes[(i - 1) % themes.length];
      const idSuffix = theme.ids[(i - 1) % theme.ids.length];
      
      let imageUrl = "";
      if (i % 2 === 0) {
        imageUrl = `https://images.unsplash.com/${idSuffix}?auto=format&fit=crop&w=640&h=1136&q=80`;
      } else {
        imageUrl = `https://picsum.photos/seed/viral-wallpaper-seed-${i}/640/1136`;
      }

      seededWallpapers.push({
        id: `wallpaper-seed-${i}`,
        title: `${theme.name} #${Math.ceil(i / themes.length)}`,
        promptText: "", // ABSOLUTELY EMPTY PROMPT TEXT FOR WALLPAPERS
        imageUrl: imageUrl,
        category: "AI Wallpapers",
        likes: Math.floor(Math.random() * 450) + 50,
        tags: [...theme.tags, "wallpaper", "viral", "4k"]
      });
    }

    promptsList = [...seededWallpapers, ...promptsList];

    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(promptsList, null, 2));
      console.log(`Successfully seeded ${seededWallpapers.length} high-quality viral AI Wallpapers!`);
    } catch (saveError) {
      console.error("Failed to write populated prompts database file with seeded wallpapers", saveError);
    }
  }

  // API endpoints for real metadata synchronization across users
  app.get("/api/prompts", (req, res) => {
    res.json(promptsList);
  });

  app.post("/api/prompts", (req, res) => {
    try {
      const { title, promptText, imageUrl, category, tags } = req.body;

      const newPrompt = {
        id: `prompt-${Date.now()}`,
        title: title || `Prompt #${promptsList.length + 1}`,
        promptText: promptText ? promptText.trim() : "",
        imageUrl: imageUrl ? imageUrl.trim() : "",
        category: category || "Photorealistic",
        likes: 0,
        tags: Array.isArray(tags) ? tags : []
      };

      promptsList.unshift(newPrompt);
      fs.writeFileSync(DATA_FILE, JSON.stringify(promptsList, null, 2));
      res.status(201).json(newPrompt);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save prompt" });
    }
  });

  app.post("/api/prompts/:id/like", (req, res) => {
    const { id } = req.params;
    let success = false;
    promptsList = promptsList.map(p => {
      if (p.id === id) {
        success = true;
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    if (success) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(promptsList, null, 2));
    }
    res.json({ success });
  });

  app.delete("/api/prompts/:id", (req, res) => {
    const { id } = req.params;
    promptsList = promptsList.filter(p => p.id !== id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(promptsList, null, 2));
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
