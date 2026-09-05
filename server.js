```javascript
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/generate", async (req, res) => {
  try {
    const { topic, niche } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        error: "Please enter a topic or niche",
      });
    }

    const prompt = `You are an expert social media content strategist specializing in Instagram.

Generate comprehensive social media content for:

Topic/Product: ${topic}
${niche ? `Niche/Industry: ${niche}` : ""}

Return ONLY valid JSON with this exact structure:

{
  "postIdeas": [
    {"id": 1, "idea": "...", "description": "..."},
    {"id": 2, "idea": "...", "description": "..."},
    {"id": 3, "idea": "...", "description": "..."}
  ],
  "captions": [
    {"caption": "..."},
    {"caption": "..."},
    {"caption": "..."}
  ],
  "hashtags": [
    "tag1", "tag2", "tag3", "tag4", "tag5",
    "tag6", "tag7", "tag8", "tag9", "tag10"
  ],
  "contentTypes": [
    {"type": "...", "description": "..."},
    {"type": "...", "description": "..."},
    {"type": "...", "description": "..."},
    {"type": "...", "description": "..."}
  ],
  "contentPlan": {
    "week1": {
      "theme": "...",
      "posts": ["...", "...", "..."]
    },
    "week2": {
      "theme": "...",
      "posts": ["...", "...", "..."]
    },
    "week3": {
      "theme": "...",
      "posts": ["...", "...", "..."]
    },
    "week4": {
      "theme": "...",
      "posts": ["...", "...", "..."]
    }
  }
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].text;

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const generatedContent = JSON.parse(jsonMatch[0]);

    res.json(generatedContent);
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      error: "Failed to generate content. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```
