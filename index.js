const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
    try {
        const targetPath = req.query.url;
        if (!targetPath) return res.status(400).send("Missing url parameter");

        const targetUrl = "https://d.flashscore.com" + targetPath;

        const response = await axios.get(targetUrl, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
                "Accept": "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "Referer": "https://www.flashscore.com/",
                "Origin": "https://www.flashscore.com",
                "X-Fsign": "SW9D1eZo",
            },
            responseType: "text",
            decompress: true,
            transformResponse: r => r
        });

        res.set("Content-Type", "text/plain; charset=utf-8");
        res.send(response.data);
    } catch (err) {
        res.status(500).send("Proxy error: " + err.message);
    }
});

app.get('/', (req, res) => {
    res.send("FlashScore Proxy is running");
});

const port = process.env.PORT || 10000;
app.listen(port, () => console.log("Proxy running on port " + port));
