'use strict';
(() => {
  const DIFF = { easy: ['Kolay', 40, 150, 40], medium: ['Orta', 32, 300, 80], hard: ['Zor', 26, 500, 120] }; // ad, ipucu sayısı, puan, XP
  const HINT_COST = 25;
  const H = (p) => window.Haptics && window.Haptics.vibrate(p);
  const G = () => window.IUCGames;
  const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pop = (m) => { let c = 0; for (; m; m &= m - 1) c++; return c; };
  const sees = (a, b) => ((a / 9) | 0) === ((b / 9) | 0) || a % 9 === b % 9 || (((a / 27) | 0) === ((b / 27) | 0) && ((a % 9 / 3) | 0) === ((b % 9 / 3) | 0));
  const cand = (g, i) => {
    const r = (i / 9) | 0, c = i % 9, br = r - (r % 3), bc = c - (c % 3); let m = 0;
    for (let k = 0; k < 9; k++) m |= (1 << g[r * 9 + k]) | (1 << g[k * 9 + c]) | (1 << g[(br + ((k / 3) | 0)) * 9 + bc + (k % 3)]);
    return ~m & 0x3fe;
  };
  // En az adaylı hücreden ilerleyen çözücü: çözüm sayısını (lim'e kadar) döndürür; rnd=true ise rastgele dolu tahta üretir.
  function search(g, lim, rnd) {
    let best = -1, bm = 0, bc = 10;
    for (let i = 0; i < 81; i++) if (!g[i]) { const m = cand(g, i), n = pop(m); if (n < bc) { best = i; bm = m; bc = n; if (n < 2) break; } }
    if (best < 0) return 1;
    if (!bc) return 0;
    const ds = []; for (let d = 1; d <= 9; d++) if (bm & (1 << d)) ds.push(d);
    if (rnd) shuffle(ds);
    let n = 0;
    for (const d of ds) { g[best] = d; n += search(g, lim - n, rnd); if (n >= lim) return n; }
    g[best] = 0; return n;
  }
  function make(level) {
    const sol = Array(81).fill(0); search(sol, 1, true);
    const p = sol.slice(); let left = 81;
    for (const i of shuffle([...Array(81).keys()])) {
      if (left <= DIFF[level][1]) break;
      const v = p[i]; p[i] = 0;
      if (search(p.slice(), 2, false) !== 1) p[i] = v; else left--;
    }
    return { sol, p };
  }

  const css = `
#sdk{position:fixed;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;gap:10px;padding:calc(env(safe-area-inset-top,0px) + 10px) 12px calc(env(safe-area-inset-bottom,0px) + 14px);background-color:var(--bgc);background-image:linear-gradient(170deg,var(--bg1),var(--bg2));color:var(--text);overflow-y:auto;touch-action:manipulation}
#sdk[hidden]{display:none}
.s-top{width:100%;max-width:420px;display:flex;align-items:center;gap:8px}
.s-top button{width:38px;height:38px;border-radius:50%;background:var(--card);box-shadow:var(--shadow);color:var(--accent)}
.s-title{font:italic 700 22px "Fraunces",Georgia,serif;margin-right:auto}
.s-pill{font-weight:800;font-size:14.5px;padding:7px 12px;border-radius:99px;background:var(--card);box-shadow:var(--shadow);font-variant-numeric:tabular-nums}
.s-bd{display:grid;grid-template-columns:repeat(9,1fr);width:min(calc(100vw - 24px),420px,calc(100dvh - 330px));min-width:270px;aspect-ratio:1;border:2px solid var(--accent);border-radius:12px;overflow:hidden;background:var(--card);box-shadow:var(--shadow)}
.sc{display:grid;place-items:center;padding:0;font-size:clamp(16px,5.4vw,26px);font-weight:800;color:var(--accent);border:.5px solid var(--sep)}
.sc.giv{color:var(--text);background:var(--soft)}.sc.rel{background:var(--soft)}.sc.same{background:rgba(232,87,125,.3)}
.sc.sel{background:var(--accent);color:#fff}.sc.r3{border-right:2px solid var(--accent)}.sc.b3{border-bottom:2px solid var(--accent)}
.sc.err{animation:serr .4s}@keyframes serr{0%,100%{background:inherit}30%{background:rgba(255,59,48,.6)}}
.nt{display:grid;grid-template-columns:repeat(3,1fr);width:100%;height:100%;font-size:clamp(7px,2.3vw,10px);font-weight:700;color:var(--muted)}.nt i{font-style:normal;display:grid;place-items:center}
.s-pad{display:grid;grid-template-columns:repeat(9,1fr);gap:5px;width:min(calc(100vw - 24px),420px)}
.s-pad button,.s-tools button{height:50px;border-radius:14px;background:var(--card);box-shadow:var(--shadow);font-weight:800;font-size:20px;color:var(--accent)}
.s-pad button:active,.s-tools button:active{transform:scale(.92)}
.s-tools{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:min(calc(100vw - 24px),420px)}.s-tools button{font-size:14px}.s-tools button.on{background:var(--accent);color:#fff}
.s-msg{position:fixed;inset:0;z-index:6;background:rgba(30,10,20,.55);display:flex;align-items:center;justify-content:center}.s-msg[hidden]{display:none}
.s-msg>div{background:var(--card);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:28px;padding:24px;text-align:center;box-shadow:var(--shadow);max-width:300px;border:1px solid var(--sep)}
.s-msg h3{margin:0 0 6px;font-size:24px}.s-msg p{margin:0 0 14px;color:var(--muted);font-weight:700}
.s-msg button{display:block;width:100%;margin:8px 0 0;padding:12px;border-radius:99px;font-weight:800;background:linear-gradient(145deg,var(--accent),var(--accent2));color:#fff}
.s-msg button.q{background:var(--soft);color:var(--accent)}`;

  let ui = null, S = null, tm = 0, cells = [];
  const mmss = (t) => Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');

  function build() {
    if (ui) return;
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    const r = document.createElement('div'); r.id = 'sdk'; r.hidden = true;
    r.innerHTML = '<div class="s-top"><button type="button" id="sX" aria-label="Kapat">✕</button><div class="s-title">Sudoku</div><div class="s-pill" id="sSc">⭐ 0</div><div class="s-pill" id="sT">0:00</div></div>' +
      '<div class="s-pill" id="sLife"></div><div class="s-bd" id="sBd"></div><div class="s-pad" id="sPad"></div>' +
      '<div class="s-tools"><button type="button" id="sN">✏️ Not</button><button type="button" id="sE">⌫ Sil</button><button type="button" id="sH">💡 İpucu −' + HINT_COST + '⭐</button></div>' +
      '<div class="s-msg" id="sM" hidden><div><h3 id="sMt"></h3><p id="sMp"></p><button data-l="easy">Kolay</button><button data-l="medium">Orta</button><button data-l="hard">Zor</button><button class="q" id="sQ">Kapat</button></div></div>';
    document.body.appendChild(r);
    const bd = r.querySelector('#sBd');
    for (let i = 0; i < 81; i++) {
      const c = document.createElement('button'); c.type = 'button'; c.dataset.i = i; bd.appendChild(c); cells.push(c);
    }
    const pad = r.querySelector('#sPad');
    for (let d = 1; d <= 9; d++) { const b = document.createElement('button'); b.type = 'button'; b.textContent = d; b.dataset.d = d; pad.appendChild(b); }
    ui = { r, sc: r.querySelector('#sSc'), t: r.querySelector('#sT'), life: r.querySelector('#sLife'), msg: r.querySelector('#sM'), mt: r.querySelector('#sMt'), mp: r.querySelector('#sMp'), nb: r.querySelector('#sN') };
    bd.onclick = (e) => { const c = e.target.closest('.sc'); if (!c || !S) return; S.sel = +c.dataset.i; H(6); paint(); };
    pad.onclick = (e) => { const b = e.target.closest('button'); if (b) digit(+b.dataset.d); };
    ui.nb.onclick = () => { if (!S) return; S.nm = !S.nm; ui.nb.classList.toggle('on', S.nm); H(6); };
    r.querySelector('#sE').onclick = () => { if (S && !S.over && S.sel >= 0 && !S.given[S.sel] && !S.g[S.sel]) { S.notes[S.sel] = 0; H(6); paint(); } };
    r.querySelector('#sH').onclick = hint;
    r.querySelectorAll('[data-l]').forEach((b) => { b.onclick = () => { H(10); newGame(b.dataset.l); }; });
    r.querySelector('#sQ').onclick = close; r.querySelector('#sX').onclick = close;
  }

  function paint() {
    const { g, sel, notes } = S, sv = sel >= 0 ? g[sel] : 0;
    cells.forEach((el, i) => {
      el.className = 'sc' + (i % 9 % 3 === 2 && i % 9 < 8 ? ' r3' : '') + ((i / 9 | 0) % 3 === 2 && i < 72 ? ' b3' : '') + (S.given[i] ? ' giv' : '') +
        (sel >= 0 && sees(sel, i) ? ' rel' : '') + (sv && g[i] === sv ? ' same' : '') + (i === sel ? ' sel' : '');
      if (g[i]) el.textContent = g[i];
      else if (notes[i]) { let h = ''; for (let d = 1; d <= 9; d++) h += '<i>' + (notes[i] & (1 << d) ? d : '') + '</i>'; el.innerHTML = '<span class="nt">' + h + '</span>'; } else el.textContent = '';
    });
    ui.life.textContent = 'Can: ' + '❤️'.repeat(3 - S.mistakes) + '🖤'.repeat(S.mistakes) + ' · ' + DIFF[S.level][0];
    ui.sc.textContent = '⭐ ' + fmt(G().stats().score); ui.t.textContent = mmss(S.time);
  }

  function put(i, d) {
    S.g[i] = d; S.notes[i] = 0; S.sel = i;
    for (let k = 0; k < 81; k++) if (sees(i, k)) S.notes[k] &= ~(1 << d);
    paint();
    if (S.g.every((v, k) => v === S.sol[k])) finish(true);
  }
  function digit(d) {
    if (!S || S.over || S.sel < 0 || S.given[S.sel] || S.g[S.sel]) return;
    const i = S.sel;
    if (S.nm) { S.notes[i] ^= 1 << d; H(6); return paint(); }
    if (d === S.sol[i]) { H(10); return put(i, d); }
    S.mistakes++; H([40, 30, 40]); paint();
    const el = cells[i]; el.classList.add('err'); setTimeout(() => el.classList.remove('err'), 420);
    if (S.mistakes >= 3) finish(false);
  }
  function hint() {
    if (!S || S.over) return;
    if (G().stats().score < HINT_COST) { G().toast('İpucu için ' + HINT_COST + ' ⭐ gerekli'); return; }
    let i = S.sel; if (i < 0 || S.g[i]) i = S.g.findIndex((v) => !v);
    if (i < 0) return;
    G().reward(-HINT_COST, 0); H(15); put(i, S.sol[i]);
  }
  function show(t, p) { ui.mt.textContent = t; ui.mp.textContent = p; ui.msg.hidden = false; }
  function finish(win) {
    S.over = true; clearInterval(tm);
    if (win) {
      const [name, , pts, xp] = DIFF[S.level], tot = pts + Math.max(0, Math.floor((600 - S.time) / 10));
      G().reward(tot, xp); H([30, 35, 80]); paint();
      setTimeout(() => show('🎉 Tebrikler!', name + ' Sudoku bitti · +' + fmt(tot) + ' ⭐ · +' + xp + ' XP · ' + mmss(S.time)), 450);
    } else { H(70); show('Olmadı 💔', '3 hata yaptın. Yeni bir tane dene!'); }
  }
  function newGame(level) {
    const { sol, p } = make(level);
    S = { level, sol, g: p.slice(), given: p.map(Boolean), notes: Array(81).fill(0), sel: -1, mistakes: 0, time: 0, nm: false, over: false };
    ui.nb.classList.remove('on'); ui.msg.hidden = true; paint();
    clearInterval(tm); tm = setInterval(() => { if (S && !S.over) { S.time++; ui.t.textContent = mmss(S.time); } }, 1000);
  }
  function open() {
    build(); ui.r.hidden = false; document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden';
    if (!S || S.over) { ui.sc.textContent = '⭐ ' + fmt(G().stats().score); show('Sudoku', 'Zorluk seç:'); if (S) paint(); }
    else { ui.msg.hidden = true; paint(); clearInterval(tm); tm = setInterval(() => { if (S && !S.over) { S.time++; ui.t.textContent = mmss(S.time); } }, 1000); }
  }
  function close() {
    clearInterval(tm); ui.r.hidden = true; document.body.style.overflow = ''; document.documentElement.style.overflow = '';
  }
  G().register({ id: 'sudoku', icon: '🔢', name: 'Sudoku', desc: 'Sakin bir zihin oyunu · puan ortak', open });
  document.addEventListener('visibilitychange', () => { if (ui && !ui.r.hidden && S && !S.over && !document.hidden) { clearInterval(tm); tm = setInterval(() => { if (S && !S.over) { S.time++; ui.t.textContent = mmss(S.time); } }, 1000); } });
})();
