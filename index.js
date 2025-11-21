
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
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': '*/*'
            },
            timeout: 15000
        });

        res.set('Content-Type', 'text/plain; charset=utf-8');
        res.send(response.data);
    } catch (err) {
        res.status(500).send("Proxy error: " + err.toString());
    }
});

app.get('/', (req, res) => {
    res.send("FlashScore Proxy is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));
