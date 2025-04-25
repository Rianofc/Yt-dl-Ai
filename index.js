const express = require("express");
const axios = require("axios");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

async function ttSearch(query, cursor = 0) {
  const res = await axios("https://tikwm.com/api/feed/search", {
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie: "current_language=en",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
    },
    data: {
      keywords: query,
      count: 1000,
      cursor,
      web: 1,
      hd: 1,
    },
    method: "POST",
  });

  return res.data.data;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/api/videos", async (req, res) => {
  const { query = "fyp welino", cursor = 0 } = req.query;
  try {
    const videos = await ttSearch(query, cursor);
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
