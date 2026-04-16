// Este script roda dentro da report.html assim que ela abre
chrome.storage.local.get(['lastReport', 'sourceUrl'], (data) => {
    const originP = document.getElementById('origin');
    const tbody = document.getElementById('report-body');

    if (originP) originP.innerText = `Origem: ${data.sourceUrl || 'Desconhecida'}`;

    if (data.lastReport && tbody) {
        data.lastReport.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="tag-badge">${item.tag}</span></td>
                <td><div class="code-info">ID: ${item.id}</div><div class="code-info">Class: ${item.class}</div></td>
                <td class="reason">${item.reasons}</td>
                <td><em>${item.content}</em></td>
            `;
            tbody.appendChild(row);
        });
    }
});