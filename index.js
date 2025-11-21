const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
    try {
        const targetPath = req.query.url;
        if (!targetPath) return res.status(400).send("Missing url parameter");

        // Строим конечный URL
        const targetUrl = "https://d.flashscore.com" + targetPath;

        // Ключевые заголовки, без них FlashScore выдаёт HTML
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.8",
            "Referer": "https://www.flashscore.com/",
            "Origin": "https://www.flashscore.com",
            "X-Fsign": "SW9D1eZo",             // КРИТИЧЕСКОЕ ЗНАЧЕНИЕ
            "X-Fgp": "1",                      // FlashScore проверяет этот ключ
            "X-GeoIP": "1",                    // Указывает FEED, что запрос из ЕС
            "Accept-Encoding": "gzip, deflate, br"
        };

        const response = await axios.get(targetUrl, {
            headers,
            responseType: "text",
            decompress: true,
        });

        res.set("Content-Type", "text/plain; charset=utf-8");
        res.send(response.data);

    } catch (err) {
        res.status(500).send("Proxy error: " + err.message);
    }
});

// Health-check
app.get("/", (req, res) => {
    res.send("FlashScore Proxy OK");
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log("FlashScore proxy running on port " + port);
});
