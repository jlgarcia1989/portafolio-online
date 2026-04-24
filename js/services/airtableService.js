/**
 * Airtable Service - Abstraction Layer for Data Persistence
 * 
 * Purpose: Centralizes all communication with Airtable API.
 * Patterns: Singleton / Service Pattern.
 * Principles: SOLID (Single Responsibility), DRY.
 */

import { CONFIG } from '../config.js';

class AirtableService {
    constructor() {
        this.baseId = CONFIG.AIRTABLE.BASE_ID;
        this.apiKey = CONFIG.AIRTABLE.API_KEY;
        this.headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Generic fetch with timeout and error handling.
     * @param {string} tableName 
     * @param {number} timeout 
     */
    async fetchTable(tableName, timeout = 8000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const url = `https://api.airtable.com/v0/${this.baseId}/${tableName}`;
            const response = await fetch(url, {
                headers: this.headers,
                signal: controller.signal
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.records || [];
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`[AirtableService] Timeout fetching ${tableName}`);
            } else {
                console.error(`[AirtableService] Error fetching ${tableName}:`, error.message);
            }
            return []; // Fail gracefully with empty array
        } finally {
            clearTimeout(timeoutId);
        }
    }

    /**
     * Formats records for easier consumption by components.
     * @param {Array} records 
     */
    mapRecords(records) {
        return records.map(r => ({ id: r.id, ...r.fields }));
    }
}

export const airtableService = new AirtableService();
