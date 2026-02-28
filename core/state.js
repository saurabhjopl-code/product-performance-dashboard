import { loadAllData } from './dataLoader.js';
import { renderExecutiveSummary } from '../summaries/executiveSummary.js';

export const STATE = {
    data: {}
};

export async function initApp() {
    STATE.data = await loadAllData();
    renderExecutiveSummary(STATE.data);
}
