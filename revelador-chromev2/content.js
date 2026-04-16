// Esta função roda automaticamente ao carregar a página
(function autoReveal() {
    console.log("Reveal All: Iniciando varredura automática...");

    const blacklistedTags = ['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT'];
    const allElements = document.querySelectorAll('*');

    allElements.forEach(el => {
        if (blacklistedTags.includes(el.tagName)) return;

        const style = window.getComputedStyle(el);
        let modified = false;

        // Revelar Display None
        if (style.display === 'none') {
            el.style.setProperty('display', 'block', 'important');
            el.style.outline = "1px dashed blue";
            modified = true;
        }

        // Revelar Visibility Hidden
        if (style.visibility === 'hidden') {
            el.style.setProperty('visibility', 'visible', 'important');
            el.style.outline = "1px dashed green";
            modified = true;
        }

        // Remover Disabled
        if (el.hasAttribute('disabled')) {
            el.removeAttribute('disabled');
            el.style.border = "1px solid red";
            modified = true;
        }

        // Transformar Hidden Inputs em visíveis
        if (el.tagName === 'INPUT' && el.type === 'hidden') {
            el.type = 'text';
            el.style.backgroundColor = "#fff0f0";
            el.style.border = "1px solid purple";
            modified = true;
        }
    });

    if (modified) {
        console.log("Reveal All: Elementos ocultos foram habilitados.");
    }
})();