import express from "express";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const apiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.4-mini",
        input: message
      })
    });

    const data = await apiRes.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "うまく話せなかった…";

    res.json({ reply });

  } catch (e) {
    console.error(e);
    res.json({ reply: "エラー出た…" });
  }
});

app.get("/", (req, res) => {
  res.send("monyu running");
});

app.listen(10000);
