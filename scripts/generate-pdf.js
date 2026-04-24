/**
 * CV PDF Generation Service - Backend Implementation
 * 
 * Logic:
 * 1. Launches a headless Chromium browser using Puppeteer.
 * 2. Navigates to the local or remote /cv-print.html.
 * 3. Waits for the 'window.cvDataLoaded' flag to ensure Airtable data is in the DOM.
 * 4. Captures the page as a high-quality A4 PDF.
 * 5. Saves the file to assets/cv-generated.pdf.
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function generateCV() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        
        // Define the path to our print view
        // In production, this would be a URL: 'https://juliangarcia.com/cv-print.html'
        const url = 'file://' + path.join(__dirname, '../cv-print.html');
        
        console.log('--- Navigating to:', url);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for dynamic content from Airtable to load
        console.log('--- Waiting for Airtable data...');
        await page.waitForFunction(() => window.cvDataLoaded === true, { timeout: 10000 });

        // Generate PDF
        console.log('--- Rendering PDF...');
        const outputPath = path.join(__dirname, '../assets/Julian_Garcia_CV_Premium.pdf');
        
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            },
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });

        console.log('--- SUCCESS: PDF generated at', outputPath);

    } catch (error) {
        console.error('--- ERROR generating PDF:', error);
    } finally {
        await browser.close();
    }
}

// Execute if run directly
if (require.main === module) {
    generateCV();
}

module.exports = { generateCV };
