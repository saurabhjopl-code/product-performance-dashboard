import { loadAllData } from './dataLoader.js';
import { renderExecutiveSummary } from '../summaries/executiveSummary.js';

export const STATE = {
    data: {},
    currentView: "executive"
};

export async function initApp() {
    STATE.data = await loadAllData();
    setupNavigation();
    renderExecutiveSummary(STATE.data);
}

function setupNavigation() {
    const buttons = document.querySelectorAll('.nav-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.dataset.view;
            STATE.currentView = view;

            document.getElementById('executive-view').style.display =
                view === "executive" ? "block" : "none";

            document.getElementById('reports-view').style.display =
                view === "reports" ? "block" : "none";
        });
    });
}
