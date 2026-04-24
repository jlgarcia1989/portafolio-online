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

// Endpoint: expone credenciales públicas de EmailJS al frontend (SDK del navegador)
// El PUBLIC_KEY de EmailJS es seguro de exponer según la documentación oficial de EmailJS.
app.get('/api/emailjs-config', (req, res) => {
    const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        return res.status(500).json({ error: 'EmailJS not configured' });
    }
    res.json({ SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY });
});

// Genera el HTML de notificación de lead para el correo
function buildEmailHtml({ from_name, from_email, phone, message }) {
    const accent = '#3b82f6';
    const year   = new Date().getFullYear();
    return `
<div style="background:#050505;padding:40px 10px;font-family:'Segoe UI',Roboto,Arial,sans-serif;color:#fff;">
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
    style="max-width:600px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden;">
    <!-- HEADER -->
    <tr>
      <td style="padding:28px 36px;border-bottom:1px solid #1a1a1a;">
        <span style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-1px;">JG<span style="color:${accent};">.</span></span>
        <span style="float:right;font-size:10px;color:${accent};font-weight:800;text-transform:uppercase;letter-spacing:2px;padding-top:8px;">NOTIFICACIÓN DE LEAD</span>
      </td>
    </tr>
    <!-- HERO -->
    <tr>
      <td style="padding:36px 36px 20px;">
        <h2 style="margin:0;font-size:24px;font-weight:700;color:#fff;">Oportunidad Estratégica Detectada</h2>
        <p style="margin:14px 0 0;font-size:15px;color:#888;line-height:1.6;">
          Hola Julian, se ha generado una nueva interacción desde tu portafolio profesional.
        </p>
      </td>
    </tr>
    <!-- DATA CARD -->
    <tr>
      <td style="padding:0 36px 36px;">
        <div style="background:linear-gradient(145deg,#0f0f0f,#080808);border:1px solid #222;border-radius:12px;padding:24px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr><td style="padding-bottom:14px;">
              <div style="font-size:10px;color:${accent};font-weight:800;text-transform:uppercase;letter-spacing:1px;">Interesado</div>
              <div style="font-size:16px;color:#fff;font-weight:600;margin-top:4px;">${from_name}</div>
            </td></tr>
            <tr><td style="padding-bottom:14px;">
              <div style="font-size:10px;color:${accent};font-weight:800;text-transform:uppercase;letter-spacing:1px;">Canal de Contacto</div>
              <div style="font-size:14px;color:#ccc;margin-top:4px;">
                <a href="mailto:${from_email}" style="color:${accent};text-decoration:none;">${from_email}</a>
                &nbsp;•&nbsp;${phone || 'N/A'}
              </div>
            </td></tr>
            <tr><td style="padding-top:14px;border-top:1px solid #1a1a1a;">
              <div style="font-size:10px;color:${accent};font-weight:800;text-transform:uppercase;letter-spacing:1px;">Mensaje Estratégico</div>
              <div style="font-size:15px;color:#fff;line-height:1.5;margin-top:8px;font-style:italic;">"${message}"</div>
            </td></tr>
          </table>
        </div>
      </td>
    </tr>
    <!-- FOOTER -->
    <tr>
      <td align="center" style="padding:24px;background:#050505;border-top:1px solid #1a1a1a;">
        <p style="margin:0;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:1px;">
          © ${year} JULIAN GARCIA | SENIOR QA SPECIALIST
        </p>
      </td>
    </tr>
  </table>
</div>`;
}

// API Proxy POST para EmailJS — genera el HTML en el servidor y lo envía como message_html
// El template en EmailJS debe tener {{{message_html}}} en el body (triple llave = HTML sin escapar)
// Recibe: { to_email, from_name, from_email, phone, message }
app.post('/api/send-email', async (req, res) => {
    try {
        const SERVICE_ID  = process.env.EMAILJS_SERVICE_ID;
        const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
        const PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY;
        const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

        if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            return res.status(500).json({ error: 'EmailJS keys not configured on the server.' });
        }

        const { to_email, from_name, from_email, phone, message } = req.body;

        if (!to_email || !from_name || !from_email || !message) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const payload = {
            service_id:  SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id:     PUBLIC_KEY,
            ...(PRIVATE_KEY && { accessToken: PRIVATE_KEY }),
            template_params: {
                to_email,
                from_name,
                from_email,
                phone: phone || 'N/A',
                message,
                message_html: buildEmailHtml({ from_name, from_email, phone, message })
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
