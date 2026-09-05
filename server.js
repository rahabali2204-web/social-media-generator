const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(__dirname));

// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/generate", async (req, res) => {
  try {
    const { topic, niche } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        error: "Please enter a topic or product.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert social media content strategist specializing in Instagram.

Generate comprehensive social media content for:

Topic/Product: ${topic}
Niche/Industry: ${niche || "General"}

Return ONLY valid JSON with this exact structure:

{
  "postIdeas": [
    {
      "id": 1,
      "idea": "...",
      "description": "..."
    },
    {
      "id": 2,
      "idea": "...",
      "description": "..."
    },
    {
      "id": 3,
      "idea": "...",
      "description": "..."
    }
  ],
  "captions": [
    {
      "caption": "..."
    },
    {
      "caption": "..."
    },
    {
      "caption": "..."
    }
  ],
  "hashtags": [
    "tag1",
    "tag2",
    "tag3",
    "tag4",
    "tag5",
    "tag6",
    "tag7",
    "tag8",
    "tag9",
    "tag10"
  ],
  "contentTypes": [
    {
      "type": "...",
      "description": "..."
    },
    {
      "type": "...",
      "description": "..."
    },
    {
      "type": "...",
      "description": "..."
    },
    {
      "type": "...",
      "description": "..."
    }
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
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const generatedContent = JSON.parse(jsonMatch[0]);

    res.json(generatedContent);

  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({
      error: "Failed to generate content. Please check your API key and try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
