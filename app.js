const express = require("express");

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message, mood = 0, bond = 0, name = "もにゅ" } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "APIキーが見つからない" });
    }

    const apiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `あなたは${name}というスライムです。やさしく短く返事してください。\n\n${message}`
      })
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(500).json({
        reply: "OpenAI error: " + JSON.stringify(data)
      });
    }

    const reply =
      data.output_text ||
      (data.output &&
        data.output[0] &&
        data.output[0].content &&
        data.output[0].content[0] &&
        data.output[0].content[0].text) ||
      "返事できなかった";

    res.json({ reply });

  } catch (e) {
    res.status(500).json({
      reply: "Server error: " + String(e)
    });
  }
});

app.get("/", (req, res) => {
  res.send("monyu-ai running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});