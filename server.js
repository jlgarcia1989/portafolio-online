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

// API Proxy POST for EmailJS (Protects the EmailJS Keys for production)
// Recibe: { to_email, from_name, from_email, phone, message, is_admin }
app.post('/api/send-email', async (req, res) => {
    try {
        const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            return res.status(500).json({ error: "EmailJS keys not configured on the server." });
        }

        const { to_email, from_name, from_email, phone, message } = req.body;

        if (!to_email || !from_name || !from_email || !message) {
            return res.status(400).json({ error: "Missing required fields: to_email, from_name, from_email, message." });
        }

        const payload = {
            service_id: SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id: PUBLIC_KEY,
            template_params: {
                to_email,
                from_name,
                from_email,
                phone: phone || 'N/A',
                message
            }
        };

        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        res.json({ success: true, status: response.data });
    } catch (error) {
        const errMsg = error.response?.data || error.message;
        console.error('[EmailJS Proxy Error]:', errMsg);
        res.status(error.response?.status || 500).json({ error: errMsg });
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
