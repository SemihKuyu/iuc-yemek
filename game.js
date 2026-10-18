'use strict';
// Pixel Patlat: bir mini oyun. Kendi arayüzünü ve stilini kendisi ekler.
(() => {
  const C = { r: '#ff5a7a', p: '#ffb3c7', y: '#ffd54a', g: '#4fcf78', b: '#8fd3ff', w: '#ffffff', o: '#ff9f43', v: '#9c7bff', n: '#4a5bb5', s: '#ffd9c0', t: '#2fc4b2' };
  const N = 12, CS = 22, B = 34, S = N * CS, LW = S + 2 * B, M = B / 2, PL = LW - B, LAP = 4 * PL, GAP = 85, SLOTS = 5;
  const SPR = [
    { bg: 'b', rows: ['............', '............', '..rrr..rrr..', '.rpprrrrrrr.', '.rpprrrrrrr.', '.rrrrrrrrrr.', '..rrrrrrrr..', '...rrrrrr...', '....rrrr....', '.....rr.....', '............', '............'] },
    { bg: 's', rows: ['............', '....pppp....', '...pppppp...', '..ppyyyypp..', '..ppyyyypp..', '...pppppp...', '....pppp....', '.....gg.....', '...g.gg.g...', '....gggg....', '.....gg.....', 'gggggggggggg'] },
    { bg: 'n', rows: ['............', '.....yy.....', '.....yy.....', '....yyyy....', 'yyyyyyyyyyyy', '.yyyyyyyyyy.', '..yyyyyyyy..', '...yyyyyy...', '...yyyyyy...', '..yyy..yyy..', '..yy....yy..', '............'] },
  ];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const SHAPES = [
    { n: 'Şişe', d: 'M9.5 1.5h5v3.4c4.2 1.3 7 4.4 7 8.6V19a3.5 3.5 0 0 1-3.5 3.5H6A3.5 3.5 0 0 1 2.5 19v-5.5c0-4.2 2.8-7.3 7-8.6z' },
    { n: 'Kalp', d: 'M12 22.5S1.8 16.2 1.8 8.8A5.8 5.8 0 0 1 12 5a5.8 5.8 0 0 1 10.2 3.8C22.2 16.2 12 22.5 12 22.5z' },
    { n: 'Yıldız', d: 'M12 1.5l3.2 6.6 7.3 1-5.3 5.1 1.3 7.3L12 17.9l-6.5 3.6 1.3-7.3L1.5 9.1l7.3-1z' },
    { n: 'Daire', d: 'M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z' },
    { n: 'Elmas', d: 'M7 2h10l5.5 6.5L12 22.5 1.5 8.5z' },
    { n: 'Damla', d: 'M12 1.5C8.5 7.5 3.5 11 3.5 15.2a8.5 8.5 0 0 0 17 0C20.5 11 15.5 7.5 12 1.5z' },
    { n: 'Altıgen', d: 'M12 1.5l9.5 5.5v10L12 22.5 2.5 17V7z' },
    { n: 'Kutu', d: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z' },
    { n: 'Kedi', d: 'M2.5 2.5l6 3.8a10.5 10.5 0 0 1 7 0l6-3.8V13a9.5 9.5 0 0 1-19 0z' },
    { n: 'Kalkan', d: 'M12 1.5l9 3.2v7.3c0 5.5-4 9.2-9 10.5-5-1.3-9-5-9-10.5V4.7z' },
  ];
  const TRIMS = [
    { n: 'Sade', c: '#ffffff', e: '', pat: '' },
    { n: 'Altın', c: '#ffd54a', e: '✦', pat: '<circle cx="1.3" cy="1.3" r=".7" fill="#fff" fill-opacity=".6"/>', w: 5 },
    { n: 'Gül', c: '#ff8fb1', e: '♥', pat: '<path d="M3 5s-2.2-1.4-2.2-2.9A1.2 1.2 0 0 1 3 1.5a1.2 1.2 0 0 1 2.2.6C5.2 3.6 3 5 3 5z" fill="#fff" fill-opacity=".5"/>', w: 6 },
    { n: 'Gece', c: '#6f78d8', e: '★', pat: '<path d="M3 .6l.6 1.7 1.8.1-1.4 1.1.5 1.7L3 4.2 1.6 5.2l.5-1.7L.6 2.4l1.8-.1z" fill="#fff" fill-opacity=".55"/>', w: 6 },
    { n: 'Buz', c: '#9be7ff', e: '❄', pat: '<path d="M0 6L6 0" stroke="#fff" stroke-opacity=".45" stroke-width="1"/>', w: 6 },
  ];
  const SKINS = TRIMS.flatMap((tr, ti) => SHAPES.map((sh, si) => {
    const k = ti * 10 + si;
    return { id: k, shape: si, trim: ti, name: sh.n + ' · ' + tr.n, req: Math.floor(k / 2.5) + 1, price: k === 0 ? 0 : Math.round((80 + 12 * k + 1.3 * k * k) / 10) * 10 };
  }));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function newImage() {
    if (Math.random() < 0.6) { const s = pick(SPR); return s.rows.map((r) => [...r].map((ch) => (ch === '.' ? s.bg : ch))); }
    const cols = shuffle(['r', 'p', 'y', 'g', 'v', 'o', 't', 'w']).slice(0, 5), bg = pick(['b', 's', 'n']);
    return Array.from({ length: N }, () => { const half = Array.from({ length: N / 2 }, () => (Math.random() < 0.3 ? bg : pick(cols))); return half.concat([...half].reverse()); });
  }

  function makeShooters(g) {
    const cnt = {};
    g.flat().forEach((c) => { cnt[c] = (cnt[c] || 0) + 1; });
    const out = [];
    for (const [c, n] of Object.entries(cnt)) {
      const k = Math.max(1, Math.round(n / 12)); let left = n;
      for (let i = 0; i < k - 1; i++) { let a = Math.round((left / (k - i)) * (0.7 + Math.random() * 0.6)); a = Math.min(Math.max(a, 1), left - (k - i - 1)); out.push({ c, ammo: a }); left -= a; }
      out.push({ c, ammo: left });
    }
    return shuffle(out).map((s) => Object.assign(s, { state: 'wait', p: 0, last: 0 }));
  }

  const css = `
.gamebtn{position:fixed;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);z-index:9;width:58px;height:58px;border-radius:50%;font-size:28px;background:linear-gradient(145deg,var(--accent),var(--accent2));box-shadow:0 10px 24px rgba(232,87,125,.4);color:#fff}
.gamebtn:active{transform:scale(.92)}
.install{bottom:calc(env(safe-area-inset-bottom,0px) + 84px)!important}
#game{position:fixed;inset:0;z-index:40;overflow-y:auto;background-color:var(--bgc);background-image:linear-gradient(170deg,var(--bg1),var(--bg2));padding:calc(env(safe-area-inset-top,0px) + 10px) 16px calc(env(safe-area-inset-bottom,0px) + 18px);display:flex;flex-direction:column;align-items:center;color:var(--text);touch-action:manipulation}
#game[hidden]{display:none}
.g-top{width:100%;max-width:380px;display:flex;align-items:center;justify-content:space-between}
.g-top button{width:38px;height:38px;border-radius:50%;background:var(--card);box-shadow:var(--shadow);font-size:16px;color:var(--accent)}
.g-title{font:italic 700 22px "Fraunces",Georgia,serif}.g-cnt{min-width:58px;text-align:center;font-weight:800;color:var(--accent);background:var(--card);padding:8px 10px;border-radius:99px;box-shadow:var(--shadow)}
.g-cnt.bad{animation:gshake .3s}@keyframes gshake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
.g-prog{width:100%;max-width:380px;height:8px;border-radius:9px;background:var(--soft);margin:12px 0;overflow:hidden}.g-prog i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .2s}
#gCv{display:block;border-radius:26px;background:var(--card);box-shadow:var(--shadow)}
.g-hint{margin:12px 0 10px;font-size:12.5px;color:var(--muted);font-weight:700;text-align:center;max-width:320px}
.g-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;width:100%;max-width:380px;margin-bottom:26px}
.sh{height:64px;position:relative;background:none;color:#fff;font-weight:800;font-size:18px;transition:transform .1s,opacity .2s}
.sh:active{transform:scale(.92)}.sh.out{opacity:.25;pointer-events:none}.sh.done{visibility:hidden}
.g-msg{position:fixed;inset:0;z-index:5;background:rgba(30,10,20,.55);display:flex;align-items:center;justify-content:center}.g-msg[hidden]{display:none}
.g-msg>div{background:var(--card);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:28px;padding:26px 24px;text-align:center;box-shadow:var(--shadow);max-width:290px;border:1px solid var(--sep)}
.g-msg h3{margin:0 0 6px;font-size:26px}.g-msg p{margin:0 0 16px;color:var(--muted);font-weight:700}
.g-msg button{margin:4px;padding:11px 18px;border-radius:99px;font-weight:800;background:linear-gradient(145deg,var(--accent),var(--accent2));color:#fff}.g-msg button+button{background:var(--soft);color:var(--accent)}
.g-msg>div{animation:gin .38s cubic-bezier(.2,1.25,.4,1)}@keyframes gin{from{transform:scale(.8);opacity:0}to{transform:none;opacity:1}}
.g-love{margin:auto 0 4px;transition:opacity .9s,transform .9s;text-align:center;font:italic 700 16px/1.5 "Fraunces",Georgia,serif;color:var(--accent);padding:13px 22px;border-radius:22px;background:var(--card);box-shadow:var(--shadow);max-width:340px}
.g-love span{display:inline-block;animation:gbeat 1.6s ease-in-out infinite}@keyframes gbeat{0%,100%{transform:scale(1)}14%{transform:scale(1.28)}28%{transform:scale(1)}42%{transform:scale(1.2)}}
.g-love.gone{opacity:0;transform:translateY(14px);pointer-events:none}
.g-stats{width:100%;max-width:380px;display:flex;justify-content:space-between;margin-top:12px}
.g-pill{font-weight:800;font-size:15px;padding:7px 14px;border-radius:99px;background:var(--card);box-shadow:var(--shadow);color:var(--text);font-variant-numeric:tabular-nums}
.g-pill.bump{animation:gbump .35s ease-out}@keyframes gbump{40%{transform:scale(1.22);color:var(--accent)}}
.g-pill.low{color:#ff3b30;animation:glow 1s ease-in-out infinite}@keyframes glow{50%{transform:scale(1.08)}}
.g-msg .g-sc{font-weight:800;color:var(--text);margin-top:-6px}
.sh svg,.pv svg{width:100%;height:100%;display:block;filter:drop-shadow(0 4px 4px rgba(0,0,0,.2))}
.sh b{position:absolute;inset:0;display:grid;place-items:center;text-shadow:0 1px 3px rgba(0,0,0,.5)}
.sh i,.pv i{position:absolute;top:1px;right:5px;font-style:normal;font-size:11px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5)}
.g-shop{position:fixed;inset:0;z-index:7;overflow-y:auto;-webkit-overflow-scrolling:touch;background-color:var(--bgc);background-image:linear-gradient(170deg,var(--bg1),var(--bg2));padding:calc(env(safe-area-inset-top,0px) + 10px) 16px calc(env(safe-area-inset-bottom,0px) + 24px);display:flex;flex-direction:column;align-items:center;color:var(--text)}
.g-shop[hidden]{display:none}
.g-skins{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:380px}
.skin{background:var(--card);border-radius:20px;padding:10px 6px 9px;box-shadow:var(--shadow);display:flex;flex-direction:column;align-items:center;gap:4px;border:2px solid transparent;color:var(--text)}
.skin.on{border-color:var(--accent)}.skin:active{transform:scale(.96)}.skin.no{animation:gshake .3s}
.pv{position:relative;width:52px;height:52px}.nm{font-size:11.5px;font-weight:800}.pr{font-size:11.5px;font-weight:800;color:var(--accent)}
.g-toast{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 14px);transform:translate(-50%,-160%);z-index:60;background:linear-gradient(145deg,var(--accent),var(--accent2));color:#fff;font-weight:800;padding:11px 18px;border-radius:99px;box-shadow:0 10px 24px rgba(232,87,125,.45);max-width:92vw;text-align:center;pointer-events:none;opacity:0}
.g-toast.show{animation:gtoast 2.8s ease both}@keyframes gtoast{0%{transform:translate(-50%,-160%);opacity:0}12%,80%{transform:translate(-50%,0);opacity:1}100%{transform:translate(-50%,-160%);opacity:0}}
.g-cnt.jam{color:#ff3b30;animation:glow .8s ease-in-out infinite}.skin.lock{opacity:.5}
.g-slots{display:flex;align-items:center;gap:8px;width:100%;max-width:380px;margin:2px 0 10px}
.g-slots span{font-size:11.5px;font-weight:800;color:var(--muted);margin-right:auto}
.g-slots i{width:34px;height:20px;border-radius:9px;background:var(--soft);border:2px dashed var(--sep);transition:background .2s}
.g-slots i.on{background:var(--accent);border-style:solid;border-color:transparent}
.g-slots.hot i.on{background:#ff3b30;animation:glow .7s ease-in-out infinite}
.sh.parked svg{filter:drop-shadow(0 0 6px #ffd54a)}.sh.parked::after{content:"↺";position:absolute;left:4px;top:0;font-size:13px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.6)}
@media(prefers-reduced-motion:reduce){.g-love span,.g-msg>div{animation:none}}`;

  let ui = null, st = null, raf = 0, dpr = 1, scale = 1, ctx = null;
  let score = 0, disp = 0, shown = -1;
  try { score = disp = parseInt(localStorage.getItem('iuc-game-score'), 10) || 0; } catch (e) { /* kayıt yok */ }
  let own = [0], eq = 0, xp = 0, armed = -1;
  try {
    const k = JSON.parse(localStorage.getItem('iuc-game-skins'));
    if (k && k.v === 2 && Array.isArray(k.own)) { own = k.own; eq = SKINS[k.eq] ? k.eq : 0; }
    xp = parseInt(localStorage.getItem('iuc-game-xp'), 10) || (parseInt(localStorage.getItem('iuc-game-lvl'), 10) || 0) * 160;
  } catch (e) { /* kayıt yok */ }
  const saveSk = () => { try { localStorage.setItem('iuc-game-skins', JSON.stringify({ v: 2, own, eq })); } catch (e) { /* yoksay */ } };
  const P2 = {};
  function skinSvg(sk, col) {
    const d = SHAPES[sk.shape].d, t = TRIMS[sk.trim], id = 'pt' + sk.trim;
    return '<svg viewBox="0 0 24 24"><defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>' +
      (t.pat ? '<pattern id="' + id + '" width="' + t.w + '" height="' + t.w + '" patternUnits="userSpaceOnUse">' + t.pat + '</pattern>' : '') + '</defs>' +
      '<path d="' + d + '" fill="' + col + '"/>' + (t.pat ? '<path d="' + d + '" fill="url(#' + id + ')"/>' : '') +
      '<path d="' + d + '" fill="url(#gl)" stroke="' + t.c + '" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  }
  let GR = null;
  const grad = () => GR || (GR = (() => { const g = ctx.createLinearGradient(0, 0, 24, 24); g.addColorStop(0, 'rgba(255,255,255,.7)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.22)'); return g; })());
  const needXp = (L) => 120 + 40 * L;
  function lvInfo(x) { let L = 1; while (x >= needXp(L)) { x -= needXp(L); L++; } return { L, cur: x, nxt: needXp(L) }; }
  const lv0 = () => lvInfo(xp).L - 1;
  const saveXp = () => { try { localStorage.setItem('iuc-game-xp', String(xp)); } catch (e) { /* yoksay */ } };
  function toast(t) { if (!ui) return; ui.toast.textContent = t; ui.toast.classList.remove('show'); void ui.toast.offsetWidth; ui.toast.classList.add('show'); }
  function levelUp(L) {
    const reward = 50 + 25 * L; addScore(reward);
    let msg = '⬆ Seviye ' + L + '! +' + reward + ' ⭐';
    if (L % 5 === 0) { const g = SKINS.find((k) => !own.includes(k.id) && k.req <= L); if (g) { own.push(g.id); saveSk(); msg += ' · 🎁 ' + g.name; } }
    toast(msg); saveXp(); if (st && ui) ui.title.textContent = 'Seviye ' + L;
  }
  function addXp(n) { const a = lvInfo(xp).L; xp += n; const b = lvInfo(xp).L; for (let L = a + 1; L <= b; L++) levelUp(L); }
  function paintEl(s) {
    const sk = SKINS[eq], e = TRIMS[sk.trim].e;
    s.el.innerHTML = skinSvg(sk, C[s.c]) + (e ? '<i>' + e + '</i>' : '') + '<b>' + s.ammo + '</b>';
  }
  const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
  function addScore(n) {
    const before = score; score = Math.max(0, score + n);
    try { localStorage.setItem('iuc-game-score', String(score)); } catch (e) { /* yoksay */ }
    if (n > 0) { ui.score.classList.remove('bump'); void ui.score.offsetWidth; ui.score.classList.add('bump'); }
    return score - before;
  }
  function paintScore(dt) {
    disp += (score - disp) * Math.min(1, dt * 7); if (Math.abs(score - disp) < 0.5) disp = score;
    const v = Math.round(disp); if (v !== shown) { shown = v; ui.score.querySelector('b').textContent = fmt(v); }
  }
  function paintTime() {
    const t = Math.max(0, Math.ceil(st.time));
    if (t === st.tshown) return;
    st.tshown = t; ui.time.querySelector('b').textContent = Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0');
    ui.time.classList[st.started && t <= 10 ? 'add' : 'remove']('low');
  }

  function build() {
    if (ui) return;
    const sty = document.createElement('style'); sty.textContent = css; document.head.appendChild(sty);
    const btn = document.createElement('button'); btn.className = 'gamebtn'; btn.type = 'button'; btn.setAttribute('aria-label', 'Oyun'); btn.textContent = '🎮';
    document.body.appendChild(btn);
    const root = document.createElement('div'); root.id = 'game'; root.hidden = true;
    root.innerHTML = '<div class="g-top"><button id="gClose" type="button" aria-label="Kapat">✕</button><div class="g-title">Pixel Patlat</div><div class="g-cnt" id="gCnt">0/5</div></div>' +
      '<div class="g-stats"><div class="g-pill" id="gScore">⭐ <b>0</b></div><button class="g-pill" id="gShopBtn" type="button">🛍️ Mağaza</button><div class="g-pill" id="gTime">⏱ <b>1:15</b></div></div><div class="g-prog"><i id="gProg"></i></div><canvas id="gCv"></canvas>' +
      '<p class="g-hint">Bir patlatıcıya dokun, bantta dönerken kendi renginin pikselini vurur. Turu bitirip mermisi kalan beklemeye geçer, 5 yuva dolarsa sıkışırsın. Süre ilk dokunuşta başlar.</p><div class="g-slots" id="gSlots"><span>Bekleme yuvaları</span><i></i><i></i><i></i><i></i><i></i></div><div class="g-grid" id="gGrid"></div>' + '<p class="g-love">Canın sıkılmasın sevgilim,<br>bu oyunu seviyorsun <span>❤</span></p>' +
      '<div class="g-msg" id="gMsg" hidden><div><h3 id="gT"></h3><p id="gP"></p><p class="g-sc" id="gP2"></p><button id="gAgain" type="button">Yeni resim</button><button id="gQuit" type="button">Kapat</button></div></div>' +
      '<div class="g-shop" id="gShop" hidden><div class="g-top"><button id="gShopBack" type="button" aria-label="Geri">←</button><div class="g-title">Mağaza</div><div class="g-cnt" id="gShopScore">0</div></div><p class="g-hint" id="gShopHint"></p><div class="g-prog"><i id="gXp"></i></div><div class="g-skins" id="gSkins"></div></div>' +
      '<div class="g-toast" id="gToast"></div>';
    document.body.appendChild(root);
    ui = { btn, root, cv: root.querySelector('#gCv'), grid: root.querySelector('#gGrid'), cnt: root.querySelector('#gCnt'), prog: root.querySelector('#gProg'), msg: root.querySelector('#gMsg'), t: root.querySelector('#gT'), p: root.querySelector('#gP'), p2: root.querySelector('#gP2'), score: root.querySelector('#gScore'), time: root.querySelector('#gTime'), love: root.querySelector('.g-love'), title: root.querySelector('.g-title'), shop: root.querySelector('#gShop'), skins: root.querySelector('#gSkins'), sscore: root.querySelector('#gShopScore'), shint: root.querySelector('#gShopHint'), xp: root.querySelector('#gXp'), slots: root.querySelector('#gSlots'), toast: root.querySelector('#gToast') };
    ctx = ui.cv.getContext('2d');
    btn.onclick = open;
    root.querySelector('#gClose').onclick = close; root.querySelector('#gQuit').onclick = close;
    root.querySelector('#gAgain').onclick = start;
    root.querySelector('#gShopBtn').onclick = openShop;
    root.querySelector('#gShopBack').onclick = () => { ui.shop.hidden = true; };
  }

  function open() {
    ui.love.classList.remove('gone'); clearTimeout(ui.loveT); ui.loveT = setTimeout(() => ui.love.classList.add('gone'), 15000);
    disp = score; shown = -1;
    ui.root.hidden = false; document.body.style.overflow = 'hidden';
    const w = Math.min(window.innerWidth - 32, 360); dpr = Math.min(window.devicePixelRatio || 1, 2); scale = w / LW;
    ui.cv.style.width = w + 'px'; ui.cv.style.height = w + 'px'; ui.cv.width = Math.round(w * dpr); ui.cv.height = Math.round(w * dpr);
    if (!st || st.over) start(); else loop();
    paintScore(0);
  }
  function close() { saveXp(); ui.shop.hidden = true; ui.root.hidden = true; document.body.style.overflow = ''; cancelAnimationFrame(raf); }

  const parkedCount = () => st.sh.filter((x) => x.state === 'parked').length;
  function paintSlots() {
    const n = parkedCount();
    ui.slots.classList[n >= SLOTS ? 'add' : 'remove']('hot');
    [...ui.slots.children].slice(1).forEach((c, i) => c.classList[i < n ? 'add' : 'remove']('on'));
  }

  function renderShop() {
    ui.sscore.textContent = '⭐ ' + fmt(score);
    const li = lvInfo(xp); ui.xp.style.width = Math.round((li.cur / li.nxt) * 100) + '%';
    ui.shint.textContent = 'Seviye ' + li.L + ' · XP ' + li.cur + '/' + li.nxt + ' · Sahip: ' + own.length + '/' + SKINS.length + ' · Almak için iki kez dokun';
    ui.skins.replaceChildren();
    for (const sk of SKINS) {
      const has = own.includes(sk.id), on = eq === sk.id, e = TRIMS[sk.trim].e;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'skin' + (on ? ' on' : '') + (!has && li.L < sk.req ? ' lock' : '');
      b.innerHTML = '<div class="pv">' + skinSvg(sk, '#ff5a7a') + (e ? '<i>' + e + '</i>' : '') + '</div><span class="nm">' + sk.name + '</span><span class="pr">' +
        (on ? 'Seçili ✓' : has ? 'Kullan' : li.L < sk.req ? '🔒 Seviye ' + sk.req : armed === sk.id ? 'Onayla ⭐ ' + sk.price : '⭐ ' + sk.price) + '</span>';
      b.onclick = () => tapSkin(sk, b);
      ui.skins.appendChild(b);
    }
  }
  function refreshSkins() { renderShop(); if (st) st.sh.forEach(paintEl); }
  function tapSkin(sk, b) {
    if (own.includes(sk.id)) { eq = sk.id; armed = -1; saveSk(); return refreshSkins(); }
    if (lvInfo(xp).L < sk.req) { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); return toast('🔒 Seviye ' + sk.req + ' gerekli'); }
    if (score < sk.price) { b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); return; }
    if (armed !== sk.id) { armed = sk.id; return renderShop(); }
    addScore(-sk.price); own.push(sk.id); eq = sk.id; armed = -1; saveSk(); refreshSkins();
  }
  function openShop() { armed = -1; renderShop(); ui.shop.hidden = false; }

  function start() {
    const g = newImage(), limit = Math.max(30, 50 - 2 * lv0());
    st = { g, total: g.flat().length, left: g.flat().length, sh: makeShooters(g), belt: [], queue: [], shots: [], pops: [], parts: [], clock: 0, lastShotC: 0, time: limit, phase: 0, jam: false, jamLeft: 0, jshown: 0, max: 4, speed: LAP / (6.6 - Math.min(1.8, 0.25 * lv0())), started: false, floats: [], cnt: {}, t: performance.now(), over: false };
    g.flat().forEach((c) => { st.cnt[c] = (st.cnt[c] || 0) + 1; });
    ui.msg.hidden = true; ui.grid.replaceChildren();
    st.sh.forEach((s) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'sh';
      b.onclick = () => launch(s); s.el = b; paintEl(s); ui.grid.appendChild(b);
    });
    ui.title.textContent = 'Seviye ' + (lv0() + 1);
    hud(); paintTime(); cancelAnimationFrame(raf); loop();
  }

  function launch(s) {
    if (st.over || (s.state !== 'wait' && s.state !== 'parked')) return;
    if (st.belt.length + st.queue.length >= st.max) { ui.cnt.classList.remove('bad'); void ui.cnt.offsetWidth; ui.cnt.classList.add('bad'); return; }
    st.started = true; s.state = 'queued'; s.el.classList.remove('parked'); s.el.classList.add('out'); st.queue.push(s); hud();
  }

  function hud() {
    ui.cnt.textContent = (st.belt.length + st.queue.length) + '/' + st.max + (st.jam ? ' ⚠' : '');
    paintSlots();
    ui.cnt.classList[st.jam ? 'add' : 'remove']('jam');
    ui.prog.style.width = Math.round(((st.total - st.left) / st.total) * 100) + '%';
  }

  function pos(p) {
    const side = Math.floor(p / PL), t = p % PL;
    if (side === 0) return { side, x: M + t, y: M };
    if (side === 1) return { side, x: LW - M, y: M + t };
    if (side === 2) return { side, x: LW - M - t, y: LW - M };
    return { side: 3, x: M, y: LW - M - t };
  }

  function target(side, x, y) {
    const g = st.g, c = Math.floor((x - B) / CS), r = Math.floor((y - B) / CS);
    if (side % 2 === 0) {
      if (c < 0 || c >= N) return null;
      if (side === 0) { for (let i = 0; i < N; i++) if (g[i][c]) return [i, c]; } else { for (let i = N - 1; i >= 0; i--) if (g[i][c]) return [i, c]; }
    } else {
      if (r < 0 || r >= N) return null;
      if (side === 1) { for (let j = N - 1; j >= 0; j--) if (g[r][j]) return [r, j]; } else { for (let j = 0; j < N; j++) if (g[r][j]) return [r, j]; }
    }
    return null;
  }

  function step(dt, now) {
    st.clock += dt;
    if (st.started) { st.time -= dt; if (st.time <= 0) { st.time = 0; return end('time'); } }
    if (st.queue.length && !st.belt.some((s) => s.p < 40)) { const s = st.queue.shift(); s.state = 'belt'; s.p = 0; st.belt.push(s); hud(); }
    for (const s of [...st.belt]) {
      s.p += st.speed * dt;
      if (s.p >= LAP) {
        st.belt.splice(st.belt.indexOf(s), 1);
        const full = parkedCount() >= SLOTS;
        s.state = 'parked'; s.el.classList.remove('out'); s.el.classList.add('parked');
        if (full) { hud(); return end('stuck'); }
        hud(); continue;
      }
      const ps = pos(s.p);
      if (s.ammo > 0 && now - s.last > GAP) {
        const t = target(ps.side, ps.x, ps.y);
        if (t && st.g[t[0]][t[1]] === s.c) {
          st.g[t[0]][t[1]] = null; st.left--; s.ammo--; s.last = now; st.lastShotC = st.clock; s.pulse = now; burst(t[0], t[1], s.c, now);
          addXp(1);
          if (--st.cnt[s.c] === 0) colorDone(t, now);
          st.shots.push({ x1: ps.x, y1: ps.y, x2: B + t[1] * CS + CS / 2, y2: B + t[0] * CS + CS / 2, at: now, c: s.c });
          s.el.querySelector('b').textContent = s.ammo;
          if (s.ammo === 0) { st.belt.splice(st.belt.indexOf(s), 1); s.state = 'done'; s.el.classList.add('done'); }
          hud();
        }
      }
    }
    st.shots = st.shots.filter((b) => now - b.at < 110);
    if (st.left === 0) return end('win');
        st.jam = parkedCount() >= SLOTS;
  }

  const REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function burst(r, c, col, now) {
    const x = B + c * CS + CS / 2, y = B + r * CS + CS / 2;
    st.pops.push({ x, y, col, at: now });
    for (let i = 0; i < (REDUCE ? 2 : 6); i++) {
      const a = Math.random() * 6.283, v = 60 + Math.random() * 90;
      st.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, s: 2.5 + Math.random() * 3, col, life: 0.45 + Math.random() * 0.25, age: 0 });
    }
    if (st.parts.length > 220) st.parts.splice(0, st.parts.length - 220);
  }

  function confetti() {
    const cols = ['#ff5a7a', '#ffb3c7', '#ffd54a', '#4fcf78', '#8fd3ff', '#9c7bff'];
    for (let i = 0; i < (REDUCE ? 20 : 70); i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = 140 + Math.random() * 220;
      st.parts.push({ x: LW / 2, y: LW * 0.55, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: 4 + Math.random() * 4, col: pick(cols), life: 1.2 + Math.random() * 0.8, age: 0, heart: Math.random() < 0.35, g: 380 });
    }
  }

  function updateParts(dt) {
    for (const p of st.parts) { p.age += dt; p.vy += (p.g || 260) * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
    st.parts = st.parts.filter((p) => p.age < p.life);
  }

  function colorDone(t, now) {
    addScore(50);
    st.floats.push({ x: B + t[1] * CS + CS / 2, y: B + t[0] * CS, text: '+50', at: now });
  }

  function end(kind) {
    st.over = true; st.jam = false; hud(); saveXp();
    const win = kind === 'win';
    if (win) {
      addXp(20);
      const bonus = Math.round(st.time) * 3, d = addScore(200 + bonus);
      ui.t.textContent = 'Harikasın sevgilim! 🎉';
      ui.p.textContent = 'Bölüm 200 + süre bonusu ' + bonus + ' = +' + d + ' puan';
      ui.p2.textContent = 'Toplam: ⭐ ' + fmt(score);
      confetti();
    } else {
      const d = addScore(-100);
      ui.t.textContent = kind === 'time' ? 'Süre doldu ⏰' : 'Sıkıştın 💔';
      ui.p.textContent = d < 0 ? '−' + Math.abs(d) + ' puan' : 'Puanın zaten sıfırdı';
      ui.p2.textContent = 'Toplam: ⭐ ' + fmt(score) + ' · Olsun, çok tatlısın 💗';
    }
    const me = st;
    setTimeout(() => { if (st === me && me.over) ui.msg.hidden = false; }, win ? 700 : 0);
  }

  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  function draw(now) {
    const k = dpr * scale; ctx.setTransform(k, 0, 0, k, 0, 0); ctx.clearRect(0, 0, LW, LW);
    const tint = st.jam ? '255,59,48' : '232,87,125';
    ctx.lineWidth = 24; ctx.strokeStyle = 'rgba(' + tint + ',' + (st.jam ? 0.26 : 0.17) + ')'; rr(M, M, PL, PL, 24); ctx.stroke();
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(' + tint + ',.45)'; ctx.beginPath();
    for (let i = 0; i < 36; i++) {
      const q = pos((st.phase + i * (LAP / 36)) % LAP), x = q.x, y = q.y;
      if (q.side === 0) { ctx.moveTo(x - 3, y - 4); ctx.lineTo(x + 2, y); ctx.lineTo(x - 3, y + 4); }
      else if (q.side === 1) { ctx.moveTo(x - 4, y - 3); ctx.lineTo(x, y + 2); ctx.lineTo(x + 4, y - 3); }
      else if (q.side === 2) { ctx.moveTo(x + 3, y - 4); ctx.lineTo(x - 2, y); ctx.lineTo(x + 3, y + 4); }
      else { ctx.moveTo(x - 4, y + 3); ctx.lineTo(x, y - 2); ctx.lineTo(x + 4, y + 3); }
    }
    ctx.stroke();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const v = st.g[r][c]; ctx.fillStyle = v ? C[v] : 'rgba(150,120,140,.14)'; rr(B + c * CS + 1, B + r * CS + 1, CS - 2, CS - 2, 4); ctx.fill();
    }
    ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const b of st.shots) { ctx.globalAlpha = 1 - (now - b.at) / 110; ctx.strokeStyle = C[b.c]; ctx.beginPath(); ctx.moveTo(b.x1, b.y1); ctx.lineTo(b.x2, b.y2); ctx.stroke(); }
    st.pops = st.pops.filter((p) => now - p.at < 240);
    for (const p of st.pops) {
      const t = (now - p.at) / 240, sz = CS - 2 + 10 * t;
      ctx.globalAlpha = (1 - t) * 0.9; ctx.fillStyle = C[p.col]; rr(p.x - sz / 2, p.y - sz / 2, sz, sz, 5); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const p of st.parts) {
      ctx.globalAlpha = 1 - p.age / p.life;
      if (p.heart) { ctx.fillStyle = p.col; ctx.font = (p.s * 3) + 'px system-ui,sans-serif'; ctx.fillText('♥', p.x, p.y); }
      else { ctx.fillStyle = C[p.col] || p.col; ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s); }
    }
    ctx.globalAlpha = 1; ctx.font = '800 11px system-ui,sans-serif';
    for (const s of st.belt) {
      const q = pos(s.p), rad = 13 + 3 * Math.max(0, 1 - (now - (s.pulse || 0)) / 120), sk = SKINS[eq];
      const path = P2[sk.shape] || (P2[sk.shape] = new Path2D(SHAPES[sk.shape].d));
      ctx.save(); ctx.translate(q.x - rad, q.y - rad); ctx.scale(rad / 12, rad / 12);
      ctx.fillStyle = C[s.c]; ctx.strokeStyle = TRIMS[sk.trim].c; ctx.lineWidth = 1.7; ctx.lineJoin = 'round'; ctx.fill(path); ctx.fillStyle = grad(); ctx.fill(path); ctx.stroke(path); ctx.restore();
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.strokeText(s.ammo, q.x, q.y + 1);
      ctx.fillStyle = '#fff'; ctx.fillText(s.ammo, q.x, q.y + 1);
    }
    st.floats = st.floats.filter((f) => now - f.at < 900);
    ctx.font = '800 18px system-ui,sans-serif'; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(90,20,50,.55)';
    for (const f of st.floats) {
      const k = (now - f.at) / 900, x = Math.min(Math.max(f.x, 26), LW - 26), y = Math.max(f.y - 34 * k, 16);
      ctx.globalAlpha = 1 - k * k; ctx.strokeText(f.text, x, y); ctx.fillStyle = '#ffd54a'; ctx.fillText(f.text, x, y);
    }
    ctx.globalAlpha = 1;
    if (st.jam && !st.over) {
      const msg = 'Sıkışma tehlikesi!';
      ctx.globalAlpha = 0.8 + 0.2 * Math.sin(now / 110); ctx.font = '800 24px system-ui,sans-serif'; ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.strokeText(msg, LW / 2, LW / 2);
      ctx.fillStyle = '#ff3b30'; ctx.fillText(msg, LW / 2, LW / 2); ctx.globalAlpha = 1;
    }
  }

  function loop() {
    cancelAnimationFrame(raf);
    st.t = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - st.t) / 1000); st.t = now;
      if (!st.over) { step(dt, now); st.phase = (st.phase + st.speed * dt) % (LAP / 36); }
      updateParts(dt); paintScore(dt); paintTime();
      { const j = st.jam ? 1 : 0; if (j !== st.jshown) { st.jshown = j; hud(); } }
      draw(now);
      if (!ui.root.hidden) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
