import { SHEETS } from '../config/sheets.js';

async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return new Promise((resolve) => {
        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data)
        });
    });
}

export async function loadAllData() {
    const data = {};
    for (const key in SHEETS) {
        if (SHEETS[key].startsWith("REPLACE")) continue;
        data[key] = await fetchCSV(SHEETS[key]);
    }
    return data;
}
