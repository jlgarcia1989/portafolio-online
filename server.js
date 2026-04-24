const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security and CORS
app.use(cors());
app.use(express.json());

// Serve static files from the root directory (Vanilla JS, HTML, CSS)
app.use(express.static(path.join(__dirname, '')));

// API Proxy for Airtable (Protects the API Key)
app.get('/api/airtable/:tableId', async (req, res) => {
    try {
        const { tableId } = req.params;
        const BASE_ID = process.env.AIRTABLE_BASE_ID || "appFrdklAuLWDpjSQ";
        const API_KEY = process.env.AIRTABLE_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: "Airtable API Key not configured on the server." });
        }

        const response = await axios.get(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Airtable Proxy Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to fetch data from Airtable" });
    }
});

// API Proxy POST for Airtable (Protects the API Key for forms)
app.post('/api/airtable/:tableId', async (req, res) => {
    try {
        const { tableId } = req.params;
        const BASE_ID = process.env.AIRTABLE_BASE_ID || "appFrdklAuLWDpjSQ";
        const API_KEY = process.env.AIRTABLE_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: "Airtable API Key not configured on the server." });
        }

        const response = await axios.post(`https://api.airtable.com/v0/${BASE_ID}/${tableId}`, req.body, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Airtable Proxy POST Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to post data to Airtable" });
    }
});

// Fallback to index.html for SPA routing (if needed)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔒 Airtable Proxy ready and secured.`);
});
