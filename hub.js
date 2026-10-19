'use strict';
// Oyun merkezi: tek 🎮 butonu, basınca oyun seçim ekranı açılır.
// Oyunlar IUCGames.register({id, icon, name, desc, open}) ile kendini ekler.
// Puan / XP ortaktır: game.js içindeki sistem IUCGames.stats() ve IUCGames.reward() ile paylaşılır.
(() => {
  const G = window.IUCGames = { games: [], register(g) { this.games.push(g); } };
  const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
  const css = `
#hub{position:fixed;inset:0;z-index:45;display:flex;flex-direction:column;align-items:center;gap:12px;padding:calc(env(safe-area-inset-top,0px) + 12px) 16px calc(env(safe-area-inset-bottom,0px) + 18px);background-color:var(--bgc);background-image:linear-gradient(170deg,var(--bg1),var(--bg2));color:var(--text);overflow-y:auto}
#hub[hidden]{display:none}
.h-top{width:100%;max-width:380px;display:flex;align-items:center;justify-content:space-between;gap:8px}
.h-top button{width:38px;height:38px;border-radius:50%;background:var(--card);box-shadow:var(--shadow);color:var(--accent)}
.h-title{font:italic 700 24px "Fraunces",Georgia,serif}
.h-pill{font-weight:800;padding:7px 14px;border-radius:99px;background:var(--card);box-shadow:var(--shadow);font-variant-numeric:tabular-nums}
.h-lv{width:100%;max-width:380px;font-size:12.5px;font-weight:800;color:var(--muted);display:flex;justify-content:space-between}
.h-xp{width:100%;max-width:380px;height:8px;border-radius:9px;background:var(--soft);overflow:hidden;margin-top:-6px}
.h-xp i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .3s}
.h-list{width:100%;max-width:380px;display:flex;flex-direction:column;gap:12px;margin-top:8px}
.h-card{display:flex;align-items:center;gap:14px;padding:16px;border-radius:24px;background:var(--card);box-shadow:var(--shadow);text-align:left;width:100%}
.h-card:active{transform:scale(.97)}
.h-card .ic{width:56px;height:56px;border-radius:18px;background:var(--soft);display:grid;place-items:center;font-size:30px;flex:none}
.h-card b{display:block;font-size:18px;font-weight:800}.h-card span{font-size:12.5px;color:var(--muted);font-weight:700}`;

  function build() {
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    const b = document.createElement('button'); b.className = 'gamebtn'; b.type = 'button'; b.setAttribute('aria-label', 'Oyunlar'); b.textContent = '🎮';
    const h = document.createElement('div'); h.id = 'hub'; h.hidden = true;
    h.innerHTML = '<div class="h-top"><button type="button" id="hX" aria-label="Kapat">✕</button><div class="h-title">Oyunlar</div><div class="h-pill" id="hS">⭐ 0</div></div>' +
      '<div class="h-lv"><span id="hL">Seviye 1</span><span id="hP"></span></div><div class="h-xp"><i id="hXp"></i></div><div class="h-list" id="hList"></div>';
    document.body.append(b, h);
    const close = () => { h.hidden = true; document.body.style.overflow = ''; };
    const paint = () => {
      const t = G.stats ? G.stats() : { score: 0, L: 1, cur: 0, nxt: 1 };
      h.querySelector('#hS').textContent = '⭐ ' + fmt(t.score);
      h.querySelector('#hL').textContent = 'Seviye ' + t.L;
      h.querySelector('#hP').textContent = fmt(t.cur) + ' / ' + fmt(t.nxt) + ' XP';
      h.querySelector('#hXp').style.width = Math.min(100, (t.cur / t.nxt) * 100) + '%';
      const list = h.querySelector('#hList'); list.replaceChildren();
      G.games.forEach((g) => {
        const c = document.createElement('button'); c.type = 'button'; c.className = 'h-card';
        c.innerHTML = '<div class="ic"></div><div><b></b><span></span></div>';
        c.querySelector('.ic').textContent = g.icon; c.querySelector('b').textContent = g.name; c.querySelector('span').textContent = g.desc;
        c.onclick = () => { if (window.Haptics) window.Haptics.vibrate(10); close(); g.open(); };
        list.appendChild(c);
      });
    };
    b.onclick = () => { if (window.Haptics) window.Haptics.vibrate(8); paint(); h.hidden = false; document.body.style.overflow = 'hidden'; };
    h.querySelector('#hX').onclick = close;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
