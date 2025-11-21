const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

function generateFsid() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < 32; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

app.get("/proxy", async (req, res) => {
    try {
        const fsid = generateFsid();

        const targetPath = req.query.url;
        if (!targetPath) return res.status(400).send("Missing url parameter");

        const targetUrl = "https://d.flashscore.com" + targetPath;

        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.8",
            "Referer": "https://www.flashscore.com/",
            "Origin": "https://www.flashscore.com",

            // ключевые флаги антибота
            "X-Fsign": "SW9D1eZo",
            "X-Ftype": "web",
            "X-Me": "123", 
            "X-Fgp": "1",
            "X-GeoIP": "1",

            // обязательная куки
            "Cookie": `fsid=${fsid};`
        };

        const response = await axios.get(targetUrl, {
            headers,
            responseType: "text",
            decompress: true,
            transformResponse: r => r
        });

        res.set("Content-Type", "text/plain; charset=utf-8");
        res.send(response.data);

    } catch (err) {
        res.status(500).send("Proxy error: " + err.toString());
    }
});

app.get("/", (req, res) => {
    res.send("FlashScore Proxy is working");
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log("FlashScore proxy running on port " + port);
});

