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
      // Force remove seed prompts if they still exist in current cached JSON
      promptsList = promptsList.filter(p => p && p.id && !p.id.startsWith("prompt-seed-"));
      fs.writeFileSync(DATA_FILE, JSON.stringify(promptsList, null, 2));
    } else {
      promptsList = [];
      fs.writeFileSync(DATA_FILE, JSON.stringify(promptsList, null, 2));
    }
  } catch (error) {
    console.error("Error reading prompts data file", error);
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
