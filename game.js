'use strict';
// Pixel Patlat: bir mini oyun. Kendi arayüzünü ve stilini kendisi ekler.
(() => {
  const C = { r: '#ff5a7a', p: '#ffb3c7', y: '#ffd54a', g: '#4fcf78', b: '#8fd3ff', w: '#ffffff', o: '#ff9f43', v: '#9c7bff', n: '#4a5bb5', s: '#ffd9c0', t: '#2fc4b2' };
  const N = 16, CS = 16, B = 34, S = N * CS, LW = S + 2 * B, M = B / 2, PL = LW - B, LAP = 4 * PL, GAP = 85, SLOTS = 5;
  const CONTINUE_COST = 5000;
  const SPR = [
    { bg: 'b', rows: ['............', '............', '..rrr..rrr..', '.rpprrrrrrr.', '.rpprrrrrrr.', '.rrrrrrrrrr.', '..rrrrrrrr..', '...rrrrrr...', '....rrrr....', '.....rr.....', '............', '............'] },
    { bg: 's', rows: ['............', '....pppp....', '...pppppp...', '..ppyyyypp..', '..ppyyyypp..', '...pppppp...', '....pppp....', '.....gg.....', '...g.gg.g...', '....gggg....', '.....gg.....', 'gggggggggggg'] },
    { bg: 'n', rows: ['............', '.....yy.....', '.....yy.....', '....yyyy....', 'yyyyyyyyyyyy', '.yyyyyyyyyy.', '..yyyyyyyy..', '...yyyyyy...', '...yyyyyy...', '..yyy..yyy..', '..yy....yy..', '............'] },
    { bg: 'b', rows: ['............', '....gggg....', '...gggggg...', '..gggggggg..', '.gggggggggg.', '.gg..gg..gg.', '.gg..gg..gg.', '.gggggggggg.', '..gggggggg..', '...gggggg...', '....gggg....', '............'] },
    { bg: 's', rows: ['............', '.....yy.....', '....yyyy....', '...yyyyyy...', '..yy.ww.yy..', '.yy..ww..yy.', '.yy.wwww.yy.', '..yyyyyyyy..', '...yy..yy...', '..yy....yy..', '.yy......yy.', '............'] },
    { bg: 'n', rows: ['............', '.....rr.....', '....rrrr....', '...rrrrrr...', '..rr.rr.rr..', '.rr..rr..rr.', '.rrrrrrrrrr.', '..rrrrrrrr..', '...rr..rr...', '..rr....rr..', '.rr......rr.', '............'] },
    { bg: 'b', rows: ['............', '......yy....', '.....yyy....', '....yyyy....', '...yyyyy....', '..yyyyyy....', '.yyyyyyy....', '....yyy.....', '....yyy.....', '....yyy.....', '....yyy.....', '............'] },
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

  function newImage(level) {
    if (Math.random() < 0.65) {
      const s = pick(SPR);
      return Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => {
        const ch = s.rows[Math.floor(r * s.rows.length / N)][Math.floor(c * s.rows[0].length / N)];
        return ch === '.' ? s.bg : ch;
      }));
    }
    const palette = shuffle(['r', 'p', 'y', 'g', 'v', 'o', 't', 'w']).slice(0, Math.min(8, 5 + Math.floor((level - 1) / 2)));
    const bg = pick(['b', 's', 'n']);
    return Array.from({ length: N }, () => { const half = Array.from({ length: N / 2 }, () => (Math.random() < 0.3 ? bg : pick(palette))); return half.concat([...half].reverse()); });
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
#game{position:fixed;inset:0;z-index:40;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;background-color:var(--bgc);background-image:linear-gradient(170deg,var(--bg1),var(--bg2));padding:calc(env(safe-area-inset-top,0px) + 10px) 16px calc(env(safe-area-inset-bottom,0px) + 18px);display:flex;flex-direction:column;align-items:center;color:var(--text);touch-action:pan-y}
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
.sh.launching{opacity:0;pointer-events:none}
.g-launch-ghost{position:fixed;z-index:1000;display:grid;place-items:center;margin:0;padding:0;border:0;border-radius:18px;background:var(--card);box-shadow:0 12px 30px rgba(90,20,50,.24);pointer-events:none;will-change:transform,opacity}
.g-msg{position:fixed;inset:0;z-index:5;background:rgba(30,10,20,.55);display:flex;align-items:center;justify-content:center}.g-msg[hidden]{display:none}
.g-msg>div{background:var(--card);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:28px;padding:26px 24px;text-align:center;box-shadow:var(--shadow);max-width:290px;border:1px solid var(--sep)}
.g-msg h3{margin:0 0 6px;font-size:26px}.g-msg p{margin:0 0 16px;color:var(--muted);font-weight:700}
.g-msg button{margin:4px;padding:11px 18px;border-radius:99px;font-weight:800;background:linear-gradient(145deg,var(--accent),var(--accent2));color:#fff}.g-msg button+button{background:var(--soft);color:var(--accent)}
.g-msg .g-continue{width:100%;margin:8px 0 10px;padding:13px 14px;background:linear-gradient(145deg,#ffd54a,#ff9f43);color:#482d12;box-shadow:0 7px 18px rgba(255,159,67,.3);font-weight:900}
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
  let own = [0], eq = 0, xp = 0, armed = -1, highScore = 0, totalEarned = 0, muted = false, achievements = [];
  try {
    const k = JSON.parse(localStorage.getItem('iuc-game-skins'));
    if (k && k.v === 2 && Array.isArray(k.own)) { own = k.own; eq = SKINS[k.eq] ? k.eq : 0; }
  } catch (e) { /* kayıt yok */ }
  try {
    xp = parseInt(localStorage.getItem('iuc-game-xp'), 10) || (parseInt(localStorage.getItem('iuc-game-lvl'), 10) || 0) * 160;
  } catch (e) { /* kayıt yok */ }
  try {
    highScore = Math.max(0, parseInt(localStorage.getItem('iuc-game-high-score'), 10) || 0);
    totalEarned = Math.max(score, parseInt(localStorage.getItem('iuc-game-total-earned'), 10) || 0);
    muted = localStorage.getItem('iuc-game-muted') === '1';
    const savedAchievements = JSON.parse(localStorage.getItem('iuc-game-achievements') || '[]');
    if (Array.isArray(savedAchievements)) achievements = savedAchievements.filter((id) => typeof id === 'string');
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
  let savedXp = xp;
  const saveXp = (force) => {
    if (!force && xp - savedXp < 5) return;
    try {
      localStorage.setItem('iuc-game-xp', String(xp));
      localStorage.setItem('iuc-game-lvl', String(lvInfo(xp).L - 1));
      savedXp = xp;
    } catch (e) { /* yoksay */ }
  };
  let lastStatsSave = 0;
  function saveStats(force) {
    const now = Date.now();
    if (!force && now - lastStatsSave < 3000) return;
    lastStatsSave = now;
    try {
      localStorage.setItem('iuc-game-high-score', String(highScore));
      localStorage.setItem('iuc-game-total-earned', String(totalEarned));
      localStorage.setItem('iuc-game-achievements', JSON.stringify(achievements));
    } catch (e) { /* yoksay */ }
  }
  function saveAchievements() {
    try { localStorage.setItem('iuc-game-achievements', JSON.stringify(achievements)); } catch (e) { /* yoksay */ }
  }
  function multiplierFor(combo) { return combo >= 14 ? 5 : combo >= 8 ? 3 : combo >= 4 ? 2 : 1; }
  function awardPoints(base, useCombo) {
    const combo = useCombo && st ? multiplierFor(st.combo) : 1;
    const fever = st && st.feverUntil > st.elapsed ? 2 : 1;
    return addScore(Math.round(base * combo * fever));
  }
  function vibrate(pattern) {
    try { if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(pattern); } catch (e) { /* desteklenmeyen cihaz */ }
  }
  let audio = null;
  let audioResume = null;
  function prepareAudio() {
    if (typeof window === 'undefined') return null;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return null;
    try {
      if (!audio) audio = new Audio();
      return audio;
    } catch (e) {
      console.warn('Oyun sesi başlatılamadı.', e);
      return null;
    }
  }
  function resumeAudio() {
    const context = prepareAudio();
    if (!context || context.state === 'running') return Promise.resolve(context);
    if (!audioResume) {
      audioResume = context.resume()
        .then(() => context)
        .catch((e) => {
          console.warn('Oyun sesi etkinleştirilemedi.', e);
          return null;
        })
        .finally(() => { audioResume = null; });
    }
    return audioResume;
  }
  function playSound(kind) {
    if (muted || typeof window === 'undefined') return;
    const play = (context) => {
      if (!context || muted || context.state !== 'running') return;
      try {
        const now = context.currentTime, presets = {
          hit: [620, 0.055, 'sine'], combo: [880, 0.13, 'triangle'], power: [740, 0.2, 'sine'],
          fever: [1046, 0.32, 'triangle'], error: [190, 0.2, 'sawtooth'], end: [523, 0.38, 'triangle'],
        };
        const [freq, duration, wave] = presets[kind] || presets.hit;
        const osc = context.createOscillator(), gain = context.createGain();
        osc.type = wave; osc.frequency.setValueAtTime(freq, now);
        if (kind === 'combo' || kind === 'fever' || kind === 'end') osc.frequency.exponentialRampToValueAtTime(freq * 1.45, now + duration);
        gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(kind === 'error' ? 0.12 : 0.08, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain); gain.connect(context.destination); osc.start(now); osc.stop(now + duration + 0.02);
      } catch (e) {
        console.warn('Oyun efekti çalınamadı.', e);
      }
    };
    if (audio && audio.state === 'running') play(audio);
    else resumeAudio().then(play);
  }
  function toast(t) {
    if (!ui) return;
    ui.toast.textContent = t; ui.toast.classList.toggle('g-achievement', t.toLocaleLowerCase('tr-TR').includes('görev tamamlandı'));
    ui.toast.classList.remove('show'); void ui.toast.offsetWidth; ui.toast.classList.add('show');
  }
  function levelUp(L) {
    const reward = 50 + 25 * L; awardPoints(reward, false);
    let msg = '⬆ Seviye ' + L + '! +' + reward + ' ⭐';
    if (L % 5 === 0) { const g = SKINS.find((k) => !own.includes(k.id) && k.req <= L); if (g) { own.push(g.id); saveSk(); msg += ' · 🎁 ' + g.name; } }
    toast(msg); saveXp(); if (st && ui) ui.title.textContent = 'Seviye ' + L;
  }
  function addXp(n) { const a = lvInfo(xp).L; xp += n; const b = lvInfo(xp).L; for (let L = a + 1; L <= b; L++) levelUp(L); saveXp(); }
  const MISSIONS = [
    { id: 'combo', icon: '🔥', target: 15, text: 'Tek oyunda 15 komboya ulaş' },
    { id: 'coffee', icon: '☕', target: 2, text: '2 kahve güçlendirmesi topla' },
    { id: 'fever', icon: '⚡', target: 2, text: 'Fever modunu 2 kez aç' },
    { id: 'special', icon: '🍽️', target: 1, text: 'Günün özel yemeğini yakala' },
  ];
  function featuredDish() {
    const meals = [...document.querySelectorAll('#list .name')].map((node) => node.textContent.trim()).filter(Boolean);
    return meals.length ? pick(meals) : 'Günün Sürpriz Yemeği';
  }
  function makeMission(dish) {
    const base = pick(MISSIONS);
    return base.id === 'special' ? Object.assign({}, base, { text: `${dish} özelini yakala` }) : Object.assign({}, base);
  }
  function floatText(text, x, y, kind) {
    if (!ui || !ui.fx) return;
    while (ui.fx.childElementCount >= 14) ui.fx.firstElementChild.remove();
    const f = document.createElement('span');
    f.className = 'g-float' + (kind ? ' ' + kind : '');
    f.textContent = text;
    f.style.left = `${x}px`; f.style.top = `${y}px`;
    ui.fx.appendChild(f);
    f.addEventListener('animationend', () => f.remove(), { once: true });
  }
  function floatAtBoard(text, x, y, kind) {
    const rect = ui.cv.getBoundingClientRect(), ratio = rect.width / LW;
    floatText(text, rect.left + x * ratio, rect.top + y * ratio, kind);
  }
  function showCombo(text) {
    ui.comboPop.textContent = text;
    ui.comboPop.classList.remove('show'); void ui.comboPop.offsetWidth; ui.comboPop.classList.add('show');
    clearTimeout(ui.comboPopTimer);
    ui.comboPopTimer = setTimeout(() => ui.comboPop.classList.remove('show'), 1050);
  }
  function shake() {
    ui.root.classList.remove('g-shake'); void ui.root.offsetWidth; ui.root.classList.add('g-shake');
    setTimeout(() => ui.root.classList.remove('g-shake'), 240);
  }
  function updateArcadeHud() {
    if (!st || !ui) return;
    const mult = multiplierFor(st.combo);
    ui.combo.textContent = `Lv ${lvInfo(xp).L}`;
    ui.combo.classList.toggle('hot', mult > 1);
    ui.mute.textContent = muted ? '🔇' : '🔊';
    ui.mute.setAttribute('aria-label', muted ? 'Sesi aç' : 'Sesi kapat');
    ui.root.classList.toggle('fever', st.feverUntil > st.elapsed);
    const buffs = [];
    if (st.coffeeUntil > st.elapsed) buffs.push(`☕${Math.ceil(st.coffeeUntil - st.elapsed)}`);
    if (st.magnetUntil > st.elapsed) buffs.push(`🧲${Math.ceil(st.magnetUntil - st.elapsed)}`);
    if (st.shield) buffs.push('🛡️');
    ui.buffLabel.textContent = buffs.join('  ');
  }
  function completeMission() {
    if (st.mission.done) return;
    st.mission.done = true;
    if (!achievements.includes(st.mission.id)) achievements.push(st.mission.id);
    awardPoints(300, false); addXp(20); saveAchievements(); saveStats(true);
    toast('Görev Tamamlandı! ✅');
    vibrate([35, 35, 70]); playSound('power');
  }
  function missionProgress(id, amount) {
    if (!st || st.mission.done || st.mission.id !== id) return;
    st.mission.progress = Math.min(st.mission.target, id === 'combo' ? st.maxCombo : st.mission.progress + amount);
    if (st.mission.progress >= st.mission.target) completeMission();
    updateArcadeHud();
  }
  function activateFever() {
    st.feverCharge = 0; st.feverUntil = st.elapsed + 7; st.feverActivations++;
    playSound('fever'); vibrate([25, 35, 55]);
    floatText('⚡ FEVER MODU! x2 PUAN', window.innerWidth / 2, 110, 'combo');
    for (let i = 0; i < 8; i++) burst(Math.floor(Math.random() * N), Math.floor(Math.random() * N), pick(['r', 'p', 'y', 'g', 'v', 'o']), performance.now());
    missionProgress('fever', 1);
  }
  function addFeverCharge(amount) {
    if (st.feverUntil > st.elapsed) return;
    st.feverCharge = Math.min(100, st.feverCharge + amount);
    if (st.feverCharge >= 100) activateFever();
  }
  function registerHit(x, y, now) {
    if (st.clock - st.comboAt > 2.25) st.combo = 0;
    st.combo++; st.comboAt = st.clock; st.maxCombo = Math.max(st.maxCombo, st.combo);
    const mult = multiplierFor(st.combo), earned = awardPoints(2, true);
    if (st.combo === 4 || st.combo === 8 || st.combo === 14) {
      showCombo(st.combo === 4 ? `COMBO x${mult}!` : st.combo === 8 ? 'SÜPER COMBO!' : 'EFSANEVİ!');
      playSound('combo'); vibrate(st.combo >= 14 ? [20, 25, 35] : 18); shake();
    } else playSound('hit');
    floatAtBoard(`+${earned}`, x, y - 4, '');
    addFeverCharge(4 + Math.min(mult, 5));
    addXp(1); missionProgress('combo', st.maxCombo);
    st.lastHitAt = now;
  }
  function paintEl(s) {
    const sk = SKINS[eq], e = TRIMS[sk.trim].e;
    s.el.innerHTML = skinSvg(sk, C[s.c]) + (e ? '<i>' + e + '</i>' : '') + '<b>' + s.ammo + '</b>';
  }
  const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
  function addScore(n) {
    const before = score; score = Math.max(0, score + n);
    try { localStorage.setItem('iuc-game-score', String(score)); } catch (e) { /* yoksay */ }
    const gained = score - before;
    if (gained > 0) {
      totalEarned += gained;
      if (st && st.started) st.runScore += gained;
      saveStats(false);
      if (ui) { ui.score.classList.remove('bump'); void ui.score.offsetWidth; ui.score.classList.add('bump'); }
    }
    return gained;
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
    root.innerHTML = '<div class="g-top"><button id="gClose" type="button" aria-label="Kapat">✕</button><div class="g-title" id="gTitle">Seviye 1</div><div class="g-pill" id="gScore">⭐ <b>0</b></div><div class="g-pill" id="gTime">⏱ <b>0:50</b></div><button class="g-mute" id="gMute" type="button" aria-label="Sesi kapat">🔊</button><button class="g-shop-button" id="gShopBtn" type="button" aria-label="Mağaza">🛍️</button></div>' +
      '<section class="g-board"><div class="g-board-head"><span class="g-cnt" id="gCnt">0/4</span><div class="g-prog"><i id="gProg"></i></div><span class="g-level" id="gCombo">Lv 1</span><span class="g-buff-label" id="gBuffLabel"></span></div><canvas id="gCv"></canvas></section>' +
      '<section class="g-bottom"><div class="g-slots" id="gSlots"><span>BEKLEME</span><i></i><i></i><i></i><i></i><i></i></div><div class="g-grid" id="gGrid"></div></section>' +
      '<div class="g-intro" id="gIntro" hidden><div class="g-intro-card"><small>🎯 TUR GÖREVİ</small><b id="gMissionText"></b><span id="gMissionTarget"></span></div></div>' +
      '<div class="g-combo-pop" id="gComboPop" aria-live="polite"></div>' +
      '<div class="g-msg" id="gMsg" hidden><div><h3 id="gT"></h3><p id="gP"></p><p class="g-sc" id="gP2"></p><p class="g-summary" id="gSummary"></p><button class="g-continue" id="gContinue" type="button" hidden>⭐ 5.000 puanla devam et</button><button id="gAgain" type="button">Yeni resim</button><button id="gQuit" type="button">Kapat</button></div></div>' +
      '<div class="g-shop" id="gShop" hidden><div class="g-top"><button id="gShopBack" type="button" aria-label="Geri">←</button><div class="g-title">Mağaza</div><div class="g-cnt" id="gShopScore">0</div></div><p class="g-hint" id="gShopHint"></p><div class="g-prog"><i id="gXp"></i></div><div class="g-skins" id="gSkins"></div></div>' +
      '<div class="g-toast" id="gToast" role="status" aria-live="polite"></div><div class="g-fx" id="gFx" aria-hidden="true"></div>';
    document.body.appendChild(root);
    ui = { btn, root, cv: root.querySelector('#gCv'), board: root.querySelector('.g-board'), boardHead: root.querySelector('.g-board-head'), grid: root.querySelector('#gGrid'), cnt: root.querySelector('#gCnt'), prog: root.querySelector('#gProg'), msg: root.querySelector('#gMsg'), t: root.querySelector('#gT'), p: root.querySelector('#gP'), p2: root.querySelector('#gP2'), summary: root.querySelector('#gSummary'), continue: root.querySelector('#gContinue'), score: root.querySelector('#gScore'), time: root.querySelector('#gTime'), title: root.querySelector('#gTitle'), shop: root.querySelector('#gShop'), skins: root.querySelector('#gSkins'), sscore: root.querySelector('#gShopScore'), shint: root.querySelector('#gShopHint'), xp: root.querySelector('#gXp'), slots: root.querySelector('#gSlots'), toast: root.querySelector('#gToast'), fx: root.querySelector('#gFx'), combo: root.querySelector('#gCombo'), comboPop: root.querySelector('#gComboPop'), intro: root.querySelector('#gIntro'), missionText: root.querySelector('#gMissionText'), missionTarget: root.querySelector('#gMissionTarget'), buffLabel: root.querySelector('#gBuffLabel'), mute: root.querySelector('#gMute') };
    ctx = ui.cv.getContext('2d');
    btn.onclick = open;
    root.querySelector('#gClose').onclick = close; root.querySelector('#gQuit').onclick = close;
    root.querySelector('#gAgain').onclick = start;
    ui.continue.onclick = continueAfterJam;
    root.querySelector('#gShopBtn').onclick = openShop;
    root.querySelector('#gShopBack').onclick = () => { ui.shop.hidden = true; };
    ui.mute.onclick = () => { muted = !muted; try { localStorage.setItem('iuc-game-muted', muted ? '1' : '0'); } catch (e) { /* yoksay */ } updateArcadeHud(); if (!muted) playSound('power'); };
    window.addEventListener('resize', updateCanvasSize, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', updateCanvasSize, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(updateCanvasSize).observe(ui.board);
  }

  function updateCanvasSize() {
    if (!ui || ui.root.hidden || !ui.board) return;
    const availableWidth = Math.min(window.innerWidth - 24, ui.board.clientWidth, 500);
    const availableHeight = Math.max(1, ui.board.clientHeight - ui.boardHead.offsetHeight - 6);
    const w = Math.max(1, Math.floor(Math.min(availableWidth, availableHeight)));
    dpr = Math.min(window.devicePixelRatio || 1, 2); scale = w / LW;
    ui.cv.style.width = `${w}px`; ui.cv.style.height = `${w}px`;
    const buffer = Math.round(w * dpr);
    if (ui.cv.width !== buffer) ui.cv.width = buffer;
    if (ui.cv.height !== buffer) ui.cv.height = buffer;
  }

  function open() {
    disp = score; shown = -1;
    ui.root.hidden = false; document.body.style.overflow = 'hidden'; document.documentElement.style.overflow = 'hidden';
    updateCanvasSize();
    if (!st || st.over) start(); else loop();
    paintScore(0);
  }
  function close() {
    saveXp(true); saveStats(true); clearTimeout(ui.introTimer); ui.shop.hidden = true; ui.root.hidden = true;
    document.body.style.overflow = ''; document.documentElement.style.overflow = ''; cancelAnimationFrame(raf);
  }

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
    const level = lv0(), g = newImage(level + 1), limit = Math.max(30, 50 - 2 * level), dish = featuredDish();
    const baseSpeed = LAP / (6.6 - Math.min(1.8, 0.25 * level));
    st = { g, total: g.flat().length, left: g.flat().length, sh: makeShooters(g), belt: [], docking: [], launching: [], queue: [], shots: [], pops: [], parts: [], drops: [], clock: 0, elapsed: 0, lastShotC: 0, time: limit, phase: 0, jam: false, jamLeft: 0, jshown: 0, max: 4, speed: baseSpeed, baseSpeed, started: false, ready: false, floats: [], cnt: {}, t: performance.now(), over: false, level, runScore: 0, combo: 0, comboAt: -10, maxCombo: 0, feverCharge: 0, feverUntil: 0, feverActivations: 0, coffeeUntil: 0, magnetUntil: 0, shield: false, coffees: 0, specials: 0, hazards: 0, nextDrop: 2 + Math.random() * 2, dish, mission: Object.assign(makeMission(dish), { progress: 0, done: false }) };
    g.flat().forEach((c) => { st.cnt[c] = (st.cnt[c] || 0) + 1; });
    ui.msg.hidden = true; ui.intro.hidden = false; ui.intro.classList.remove('leaving'); ui.root.classList.remove('fever', 'g-shake'); ui.grid.replaceChildren();
    ui.missionText.textContent = st.mission.text;
    ui.missionTarget.textContent = `Hedef: ${st.mission.target}`;
    clearTimeout(ui.introTimer);
    ui.introTimer = setTimeout(() => {
      if (st && !st.over) {
        st.ready = true;
        ui.intro.classList.add('leaving');
        setTimeout(() => { if (ui.intro.classList.contains('leaving')) ui.intro.hidden = true; }, 420);
      }
    }, 2300);
    st.sh.forEach((s) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'sh';
      b.addEventListener('pointerdown', (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        s.pointerAt = performance.now(); event.preventDefault(); launch(s);
      });
      b.onclick = (event) => { if (event.detail === 0 || !s.pointerAt || performance.now() - s.pointerAt > 500) launch(s); };
      s.el = b; paintEl(s);
    });
    renderShooterQueue(true);
    ui.title.textContent = 'Seviye ' + (lv0() + 1);
    hud(); paintTime(); updateCanvasSize(); cancelAnimationFrame(raf); loop();
  }

  function launch(s) {
    if (st.over || !st.ready || (s.state !== 'wait' && s.state !== 'parked')) return;
    if (st.belt.length + st.queue.length + st.docking.length + st.launching.length >= st.max) {
      ui.cnt.classList.remove('bad'); void ui.cnt.offsetWidth; ui.cnt.classList.add('bad');
      playSound('error'); vibrate(22); return;
    }
    if (!muted) resumeAudio();
    const game = st;
    game.started = true; s.state = 'launching'; s.el.classList.remove('parked'); s.el.classList.add('launching');
    game.launching.push(s); hud();
    animateLauncher(s).then(() => {
      game.launching.splice(game.launching.indexOf(s), 1);
      if (st !== game || game.over || s.state !== 'launching') return;
      s.state = 'queued'; s.el.classList.remove('launching'); s.el.classList.add('out');
      game.queue.push(s); hud();
    });
  }

  function animateLauncher(s) {
    const source = s.el.getBoundingClientRect(), board = ui.cv.getBoundingClientRect();
    const start = pos(0), unit = board.width / LW;
    const targetX = board.left + start.x * unit, targetY = board.top + start.y * unit;
    const ghost = s.el.cloneNode(true);
    ghost.className = 'sh g-launch-ghost';
    ghost.style.left = `${source.left}px`; ghost.style.top = `${source.top}px`;
    ghost.style.width = `${source.width}px`; ghost.style.height = `${source.height}px`;
    document.body.appendChild(ghost);
    if (typeof ghost.animate !== 'function') {
      ghost.remove();
      return Promise.resolve();
    }
    const dx = targetX - (source.left + source.width / 2), dy = targetY - (source.top + source.height / 2);
    let animation;
    try {
      animation = ghost.animate([
        { transform: 'translate3d(0,0,0) scale(1) rotate(0deg)', opacity: 1, offset: 0 },
        { transform: `translate3d(${dx * 0.18}px,${dy * 0.18 - 28}px,0) scale(1.12) rotate(-8deg)`, opacity: 1, offset: 0.34 },
        { transform: `translate3d(${dx}px,${dy}px,0) scale(.3) rotate(180deg)`, opacity: 0.15, offset: 1 },
      ], { duration: REDUCE ? 180 : 460, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    } catch (error) {
      ghost.remove();
      console.warn('Atıcı animasyonu başlatılamadı.', error);
      return Promise.resolve();
    }
    return animation.finished.catch((error) => {
      if (error.name !== 'AbortError') console.warn('Atıcı animasyonu tamamlanamadı.', error);
    }).finally(() => ghost.remove());
  }

  function hud() {
    ui.cnt.textContent = (st.belt.length + st.queue.length + st.docking.length + st.launching.length) + '/' + st.max + (st.jam ? ' ⚠' : '');
    paintSlots();
    ui.cnt.classList[st.jam ? 'add' : 'remove']('jam');
    ui.prog.style.width = Math.round(((st.total - st.left) / st.total) * 100) + '%';
    updateArcadeHud();
  }

  function renderShooterQueue(force) {
    if (!st || !ui) return;
    const visible = st.sh.filter((s) => s.state !== 'done').slice(0, 10);
    const signature = visible.map((s) => st.sh.indexOf(s)).join(',');
    if (!force && signature === st.queueSignature) return;
    const before = new Map(visible.map((s) => [s, s.el.getBoundingClientRect()]));
    st.queueSignature = signature;
    ui.grid.replaceChildren(...visible.map((s) => s.el));
    const moves = [];
    for (const s of visible) {
      const old = before.get(s), next = s.el.getBoundingClientRect(), dy = old.top - next.top;
      if (Math.abs(dy) > 2) {
        s.el.style.transition = 'none'; s.el.style.transform = `translateY(${dy}px)`; moves.push(s.el);
      }
    }
    if (moves.length) requestAnimationFrame(() => {
      moves.forEach((node) => { node.style.transition = ''; node.style.transform = ''; });
    });
  }

  function pos(p) {
    p = (p + 3 * PL) % LAP;
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

  function dynamicDifficulty() {
    return Math.min(1, Math.max(0, (lvInfo(xp).L - 1) / 14 + Math.log1p(score) / 30));
  }
  function circularDistance(a, b) {
    const d = Math.abs(a - b) % LAP;
    return Math.min(d, LAP - d);
  }
  function spawnDrop() {
    if (st.drops.length >= 3) return;
    const difficulty = dynamicDifficulty(), roll = Math.random();
    let kind;
    if (roll < 0.13 + difficulty * 0.16) kind = 'hazard';
    else if (roll < 0.19 + difficulty * 0.16) kind = 'special';
    else kind = pick(['coffee', 'magnet', 'shield']);
    st.drops.push({ kind, p: Math.random() * LAP, label: st.dish });
  }
  function collectDrop(s, drop, now) {
    st.drops.splice(st.drops.indexOf(drop), 1);
    const q = pos(s.p), screenX = ui.cv.getBoundingClientRect().left + q.x * (ui.cv.getBoundingClientRect().width / LW);
    const screenY = ui.cv.getBoundingClientRect().top + q.y * (ui.cv.getBoundingClientRect().width / LW);
    if (drop.kind === 'hazard') {
      if (st.shield) {
        st.shield = false; floatText('🛡️ ENGELİ SAVDI!', screenX, screenY, 'power'); playSound('power'); vibrate(25);
      } else {
        st.hazards++; st.combo = 0; st.time = Math.max(0, st.time - 4);
        floatText('🔥 YANMIŞ TEPSİ · −4 sn', screenX, screenY, 'error');
        st.parts.push({ x: q.x, y: q.y, vx: 0, vy: -35, s: 10, col: '#ff3b30', life: 0.55, age: 0 });
        playSound('error'); vibrate([35, 25, 35]); shake();
      }
      hud(); return;
    }
    if (drop.kind === 'coffee') {
      st.coffeeUntil = Math.max(st.coffeeUntil, st.elapsed) + 8; st.coffees++;
      floatText('☕ TEMPO YAVAŞLADI', screenX, screenY, 'power'); missionProgress('coffee', 1);
    } else if (drop.kind === 'magnet') {
      st.magnetUntil = Math.max(st.magnetUntil, st.elapsed) + 8;
      floatText('🧲 MIKNATIS AKTİF', screenX, screenY, 'power');
    } else if (drop.kind === 'shield') {
      st.shield = true; floatText('🛡️ KALKAN HAZIR', screenX, screenY, 'power');
    } else {
      const earned = awardPoints(250, false); st.specials++;
      floatText(`🍽️ GÜNÜN ÖZELİ +${earned}`, screenX, screenY, 'power');
      addFeverCharge(25); addXp(5); missionProgress('special', 1);
    }
    burst(Math.max(0, Math.min(N - 1, Math.floor((q.y - B) / CS))), Math.max(0, Math.min(N - 1, Math.floor((q.x - B) / CS))), drop.kind === 'special' ? 'y' : 'g', now);
    playSound('power'); vibrate(24); hud();
  }
  function updateDrops(dt, now) {
    if (st.started && st.elapsed >= st.nextDrop) {
      spawnDrop();
      const difficulty = dynamicDifficulty();
      st.nextDrop = st.elapsed + Math.max(4.2, 8.4 - difficulty * 3.3 + Math.random() * 2.4);
    }
    if (st.magnetUntil > st.elapsed && st.belt.length) {
      for (const drop of st.drops) {
        if (drop.kind === 'hazard') continue;
        let nearest = null, distance = Infinity, delta = 0;
        for (const s of st.belt) {
          const d = ((s.p - drop.p + LAP / 2) % LAP) - LAP / 2;
          if (Math.abs(d) < distance) { nearest = s; distance = Math.abs(d); delta = d; }
        }
        if (nearest && distance > 20) drop.p = (drop.p + Math.sign(delta) * Math.min(distance, dt * 240) + LAP) % LAP;
      }
    }
    for (const drop of [...st.drops]) {
      const hit = st.belt.find((s) => circularDistance(s.p, drop.p) < 23);
      if (hit) collectDrop(hit, drop, now);
    }
  }

  function step(dt, now) {
    st.elapsed += dt;
    const coffee = st.coffeeUntil > st.elapsed, gameDt = dt * (coffee ? 0.55 : 1);
    st.clock += gameDt;
    if (st.feverUntil && st.feverUntil <= st.elapsed) { st.feverUntil = 0; ui.root.classList.remove('fever'); }
    if (st.started) { st.time -= gameDt; if (st.time <= 0) { st.time = 0; return end('time'); } }
    const difficulty = dynamicDifficulty();
    st.speed = st.baseSpeed * (1 + difficulty * 0.3);
    if (st.combo && st.clock - st.comboAt > 2.25) { st.combo = 0; updateArcadeHud(); }
    if (st.queue.length && !st.belt.some((s) => s.p < 40)) { const s = st.queue.shift(); s.state = 'belt'; s.p = 0; st.belt.push(s); hud(); }
    for (const s of [...st.belt]) {
      s.p += st.speed * gameDt;
      if (s.p >= LAP) {
        st.belt.splice(st.belt.indexOf(s), 1);
        s.state = 'docking'; st.docking.push({ shooter: s, at: now });
        continue;
      }
      const ps = pos(s.p);
      if (s.ammo > 0 && now - s.last > GAP) {
        const t = target(ps.side, ps.x, ps.y);
        if (t && st.g[t[0]][t[1]] === s.c) {
          st.g[t[0]][t[1]] = null; st.left--; s.ammo--; s.last = now; st.lastShotC = st.clock; s.pulse = now; burst(t[0], t[1], s.c, now);
          registerHit(B + t[1] * CS + CS / 2, B + t[0] * CS + CS / 2, now);
          if (--st.cnt[s.c] === 0) colorDone(t, now);
          st.shots.push({ x1: ps.x, y1: ps.y, x2: B + t[1] * CS + CS / 2, y2: B + t[0] * CS + CS / 2, at: now, c: s.c });
          s.el.querySelector('b').textContent = s.ammo;
          if (s.ammo === 0) {
            st.belt.splice(st.belt.indexOf(s), 1); s.state = 'done'; s.el.classList.add('done');
            setTimeout(() => renderShooterQueue(false), 220);
          }
          hud();
        }
      }
    }
    for (const dock of [...st.docking]) {
      if (now - dock.at < 260) continue;
      st.docking.splice(st.docking.indexOf(dock), 1);
      dock.shooter.state = 'parked';
      dock.shooter.el.classList.remove('out');
      dock.shooter.el.classList.add('parked');
      hud();
      if (parkedCount() >= SLOTS) return end('stuck');
    }
    updateDrops(dt, now);
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
    const earned = awardPoints(50, true);
    floatAtBoard(`+${earned} RENK TAMAMLANDI`, B + t[1] * CS + CS / 2, B + t[0] * CS, 'combo');
    st.floats.push({ x: B + t[1] * CS + CS / 2, y: B + t[0] * CS, text: '+50', at: now });
  }

  function end(kind) {
    st.scoreAtEnd = score;
    st.over = true; st.jam = false; clearTimeout(ui.introTimer); ui.intro.hidden = true; ui.root.classList.remove('fever'); hud();
    ui.continue.hidden = kind !== 'stuck';
    const win = kind === 'win';
    if (win) {
      addXp(20);
      const bonus = Math.round(st.time) * 3, d = awardPoints(200 + bonus, false);
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
    ui.continue.hidden = kind !== 'stuck' || st.scoreAtEnd < CONTINUE_COST;
    highScore = Math.max(highScore, st.runScore);
    ui.summary.textContent = `Bu tur: ${fmt(st.runScore)} puan · Rekor: ${fmt(highScore)} · En iyi kombo: ${st.maxCombo} · Kahve: ${st.coffees} · Özel yemek: ${st.specials} · Fever: ${st.feverActivations} · Rozet: ${achievements.length}`;
    saveXp(true); saveStats(true); playSound('end');
    if (win) vibrate([30, 35, 80]); else vibrate([70]);
    const me = st;
    setTimeout(() => { if (st === me && me.over) ui.msg.hidden = false; }, win ? 700 : 0);
  }

  function continueAfterJam() {
    if (!st || !st.over || parkedCount() < SLOTS || st.scoreAtEnd < CONTINUE_COST) return;
    addScore(100 - CONTINUE_COST);
    for (const s of st.sh) {
      if (s.state !== 'parked') continue;
      s.state = 'wait';
      s.el.classList.remove('parked', 'out', 'done');
    }
    st.jam = false;
    st.over = false;
    st.ready = true;
    st.started = true;
    st.t = performance.now();
    st.queueSignature = null;
    ui.continue.hidden = true;
    ui.msg.hidden = true;
    renderShooterQueue(true);
    hud();
    playSound('power');
    toast('5.000 puan harcandı · Tur devam ediyor!');
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
    const socket = pos(0), sx = socket.x, sy = socket.y;
    ctx.save();
    ctx.globalAlpha = 0.8 + 0.2 * Math.sin(now / 420);
    ctx.beginPath(); ctx.arc(sx, sy, 19, 0, Math.PI * 2);
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(' + tint + ',.22)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(sx, sy, 15, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.96)'; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(' + tint + ',.8)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(sx, sy, 9, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + tint + ',.14)'; ctx.fill();
    ctx.beginPath(); ctx.arc(sx, sy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + tint + ',.95)'; ctx.fill();
    ctx.beginPath(); ctx.arc(sx, sy, 1.7, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(sx - 4, sy - 23); ctx.lineTo(sx, sy - 27); ctx.lineTo(sx + 4, sy - 23);
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(' + tint + ',.85)'; ctx.stroke();
    ctx.restore();
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
    for (const drop of st.drops) {
      const q = pos(drop.p), icon = { coffee: '☕', magnet: '🧲', shield: '🛡️', special: '🍽️', hazard: '🔥' }[drop.kind];
      ctx.save(); ctx.globalAlpha = 0.9 + 0.1 * Math.sin(now / 150 + drop.p);
      ctx.beginPath(); ctx.arc(q.x, q.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = drop.kind === 'hazard' ? 'rgba(255,59,48,.9)' : 'rgba(255,213,74,.92)'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = '19px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(icon, q.x, q.y + 1);
      ctx.restore();
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
    for (const dock of st.docking) {
      const progress = Math.min(1, (now - dock.at) / 260), q = pos(LAP);
      const rad = 15 * (1 - progress * 0.78), sk = SKINS[eq];
      const path = P2[sk.shape] || (P2[sk.shape] = new Path2D(SHAPES[sk.shape].d));
      ctx.save(); ctx.globalAlpha = 1 - progress * 0.55; ctx.translate(q.x - rad, q.y - rad); ctx.scale(rad / 12, rad / 12);
      ctx.fillStyle = C[dock.shooter.c]; ctx.strokeStyle = TRIMS[sk.trim].c; ctx.lineWidth = 1.7; ctx.lineJoin = 'round'; ctx.fill(path); ctx.fillStyle = grad(); ctx.fill(path); ctx.stroke(path); ctx.restore();
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
      if (now - (st.hudAt || 0) > 160) { st.hudAt = now; updateArcadeHud(); }
      { const j = st.jam ? 1 : 0; if (j !== st.jshown) { st.jshown = j; hud(); } }
      draw(now);
      if (!ui.root.hidden) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
