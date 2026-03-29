import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// MAIN ANALYZE ROUTE
app.post("/analyze", async (req, res) => {
  try {
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({ error: "Report text is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are a clinical assistant AI.

Analyze the following input. It may be symptoms, report, or prescription.

Return ONLY valid JSON. No explanation. No markdown.

Format:
{
  "summary": "",
  "possible_condition": "",
  "risk_level": "",
  "recommendations": []
}

Input:
${report}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let aiText = response.data.choices[0].message.content;

    // 🔥 CLEAN AI RESPONSE
    aiText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (e) {
      parsed = { ai_response: aiText };
    }

    res.json(parsed);

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});