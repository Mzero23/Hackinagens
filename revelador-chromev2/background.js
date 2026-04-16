chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (tab.url.startsWith('chrome://')) return;

    // 1. Executa a revelação e coleta de dados simultaneamente
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: revealAndCollect
    });

    const hiddenData = results[0].result;

    // 2. Salva no storage para o relatório
    chrome.storage.local.set({ 
      lastReport: hiddenData, 
      sourceUrl: tab.url 
    }, () => {
      // 3. Abre a aba do relatório
      chrome.tabs.create({ url: chrome.runtime.getURL('report.html') });
    });

  } catch (err) {
    console.error("Erro na execução:", err);
  }
});

function revealAndCollect() {
  const blacklistedTags = ['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'HEAD', 'TITLE'];
  const all = document.querySelectorAll('*');
  const report = [];

  all.forEach((el) => {
    if (blacklistedTags.includes(el.tagName)) return;

    const style = window.getComputedStyle(el);
    let reasons = [];

    // Lógica de Revelação Direta na Página
    if (style.display === 'none') {
        reasons.push("display: none");
        el.style.setProperty('display', 'block', 'important');
        el.style.outline = "1px dashed blue";
    }
    if (style.visibility === 'hidden') {
        reasons.push("visibility: hidden");
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.outline = "1px dashed green";
    }
    if (parseFloat(style.opacity) === 0) {
        reasons.push("opacity: 0");
        el.style.setProperty('opacity', '1', 'important');
    }
    if (el.hasAttribute('disabled')) {
        reasons.push("Atributo 'disabled'");
        el.removeAttribute('disabled');
        el.style.border = "1px solid red";
    }
    if (el.tagName === 'INPUT' && el.type === 'hidden') {
        reasons.push("Input tipo hidden");
        el.type = 'text';
        el.style.border = "1px solid purple";
        el.style.backgroundColor = "#fff0f0";
    }

    // Se algo foi detectado, adiciona ao relatório
    if (reasons.length > 0) {
      let content = el.innerText?.trim() || el.getAttribute('placeholder') || el.value || "";
      content = content.substring(0, 80).replace(/\n/g, ' ');

      if (content.length > 0 || ['INPUT', 'BUTTON', 'A'].includes(el.tagName)) {
        report.push({
          tag: el.tagName,
          id: el.id || "-",
          class: el.className || "-",
          reasons: reasons.join(", "),
          content: content || "(Vazio)"
        });
      }
    }
  });
  return report;
}