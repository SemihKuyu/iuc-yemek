'use strict';
// Titreşim: Android'de navigator.vibrate, iPhone'da (Safari desteklemediği için)
// gizli bir <input type="checkbox" switch> tıklatılarak sistem haptiği tetiklenir.
(() => {
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let lab = null;
  function tick() {
    try {
      if (!lab) {
        lab = document.createElement('label');
        lab.setAttribute('aria-hidden', 'true');
        lab.style.cssText = 'position:fixed;left:-100px;top:-100px;width:1px;height:1px;opacity:0;pointer-events:none';
        const i = document.createElement('input'); i.type = 'checkbox'; i.setAttribute('switch', '');
        lab.appendChild(i); document.body.appendChild(lab);
      }
      lab.click();
    } catch (e) { /* yoksay */ }
  }
  window.Haptics = {
    vibrate(p) {
      try { if (typeof navigator.vibrate === 'function') { navigator.vibrate(p); return; } } catch (e) { /* yoksay */ }
      if (!ios || !document.body) return;
      const a = Array.isArray(p) ? p : [p]; let t = 0;
      a.forEach((d, i) => { if (i % 2 === 0) { if (t) setTimeout(tick, t); else tick(); } t += d; });
    },
  };
})();
