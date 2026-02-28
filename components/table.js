export function renderTable(containerId, data) {
    const container = document.getElementById(containerId);
    if (!data || data.length === 0) {
        container.innerHTML = "<p>No data available</p>";
        return;
    }

    const headers = Object.keys(data[0]);

    let table = "<table><thead><tr>";
    headers.forEach(h => table += `<th>${h}</th>`);
    table += "</tr></thead><tbody>";

    data.forEach(row => {
        table += "<tr>";
        headers.forEach(h => table += `<td>${row[h]}</td>`);
        table += "</tr>";
    });

    table += "</tbody></table>";
    container.innerHTML = table;
}
