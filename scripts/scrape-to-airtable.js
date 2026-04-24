/**
 * Automated Scraper & Airtable Sync Engine
 * 
 * Logic:
 * 1. Reads local HTML files of the portfolio.
 * 2. Scrapes professional data (Experience, Skills, Projects, etc.).
 * 3. Synchronizes (Upserts) the data to Airtable to maintain a single Source of Truth.
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const axios = require('axios');

// Load API Key and Base from config (parsing the ES module manually or hardcoding for the script)
const AIRTABLE_API_KEY = "TU_PERSONAL_ACCESS_TOKEN";
const BASE_ID = "TU_BASE_ID";

const airtable = axios.create({
    baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
    headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
});

/**
 * Utility to clear a table before repopulating (Professional way to ensure sync)
 */
async function clearTable(tableName) {
    try {
        const res = await airtable.get(`/${tableName}`);
        const ids = res.data.records.map(r => r.id);
        for (let i = 0; i < ids.length; i += 10) {
            const batch = ids.slice(i, i + 10);
            await airtable.delete(`/${tableName}`, { params: { 'records[]': batch } });
        }
    } catch (e) { console.warn(`Error clearing ${tableName}:`, e.message); }
}

/**
 * Main Sync Function
 */
async function sync() {
    console.log('🚀 Starting Portfolio-to-Airtable Synchronization...');

    const rootDir = path.join(__dirname, '..');

    // --- 1. SCRAPE PROFILE (index.html) ---
    const indexHTML = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    const indexDom = new JSDOM(indexHTML).window.document;
    
    const profile = {
        Name: indexDom.querySelector('.hero-name')?.textContent?.trim() || "Julian Garcia",
        Role: indexDom.querySelector('.hero .subtitle')?.textContent?.trim() || "QA Senior",
        Summary: "Garantizando calidad estratégica mediante la sinergia entre testeo manual, automatización e IA.",
        Email: "jlgarcia1989@hotmail.com",
        Phone: "+57 316 235 6114",
        LinkedIn: "https://www.linkedin.com/in/julian-leonardo-garcia-garzon-326818146"
    };

    await clearTable('Profile');
    await airtable.post('/Profile', { records: [{ fields: profile }] });
    console.log('✅ Profile Synced');

    // --- 2. SCRAPE EXPERIENCE (experiencia.html) ---
    if (fs.existsSync(path.join(rootDir, 'experiencia.html'))) {
        const expHTML = fs.readFileSync(path.join(rootDir, 'experiencia.html'), 'utf8');
        const expDom = new JSDOM(expHTML).window.document;
        const items = Array.from(expDom.querySelectorAll('.timeline-item')).map((item, index) => ({
            fields: {
                Company: item.querySelector('h3')?.textContent?.trim(),
                Role: item.querySelector('.accent-text')?.textContent?.trim(),
                Period: item.querySelector('.timeline-date')?.textContent?.trim(),
                Description: item.querySelector('p:not(.accent-text)')?.textContent?.trim(),
                Order: items.length - index
            }
        }));
        await clearTable('Experience');
        for (let i = 0; i < items.length; i += 10) {
            await airtable.post('/Experience', { records: items.slice(i, i + 10) });
        }
        console.log(`✅ ${items.length} Experience items synced`);
    }

    // --- 3. SCRAPE SKILLS (habilidades.html) ---
    if (fs.existsSync(path.join(rootDir, 'habilidades.html'))) {
        const skillHTML = fs.readFileSync(path.join(rootDir, 'habilidades.html'), 'utf8');
        const skillDom = new JSDOM(skillHTML).window.document;
        const cards = Array.from(skillDom.querySelectorAll('.skill-card')).map(card => ({
            fields: {
                Category: card.querySelector('h3')?.textContent?.trim(),
                SkillList: card.querySelector('.stat-label')?.textContent?.trim()
            }
        }));
        await clearTable('Skills');
        await airtable.post('/Skills', { records: cards });
        console.log(`✅ ${cards.length} Skill categories synced`);
    }

    // --- 4. SCRAPE PROJECTS (proyectos.html) ---
    if (fs.existsSync(path.join(rootDir, 'proyectos.html'))) {
        const projHTML = fs.readFileSync(path.join(rootDir, 'proyectos.html'), 'utf8');
        const projDom = new JSDOM(projHTML).window.document;
        const projects = Array.from(projDom.querySelectorAll('.project-card')).map(p => ({
            fields: {
                Title: p.querySelector('h3')?.textContent?.trim(),
                Description: p.querySelector('p')?.textContent?.trim(),
                TechStack: "QA / Automation / AI",
                Link: "https://github.com"
            }
        }));
        await clearTable('Projects');
        if (projects.length > 0) {
            await airtable.post('/Projects', { records: projects });
        }
        console.log(`✅ ${projects.length} Projects synced`);
    }

    console.log('🎉 Sync Complete! All data is now in Airtable.');
}

sync().catch(console.error);
