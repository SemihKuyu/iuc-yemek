'use strict';
(() => {
  const P = window.MenuParse;
  const $ = (id) => document.getElementById(id);
  const TZ = 'Europe/Istanbul';
  const CLOSE_MIN = 14 * 60 + 30;
  const DOW = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
  const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const CATS = [['Çorba', 'Çorba'], ['Ana Yemek', 'Ana Yemek'], ['Yan Yemek', 'Yan Yemek'], ['Tamamlayıcı', 'Ek']];
  const SRC = 'data/menu.txt';
  const LS = { data: 'iuc-menu-text', hint: 'iuc-install-dismissed' };

  let menus = {}, updated = null, rawText = null, selected = null, weekStart = null, rerouted = false;

  const pad = (n) => String(n).padStart(2, '0');
  const toKey = (t) => { const d = new Date(t); return `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`; };
  const toTime = (k) => { const [d, m, y] = k.split('.').map(Number); return Date.UTC(y, m - 1, d); };
  const addDays = (k, n) => toKey(toTime(k) + n * 86400000);
  const dow = (k) => new Date(toTime(k)).getUTCDay();
  const mondayOf = (k) => addDays(k, -((dow(k) + 6) % 7));
  const store = (fn) => { try { return fn(); } catch { return null; } };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const longDate = (k) => { const [d, m] = k.split('.').map(Number); return `${d} ${MONTHS[m - 1]}`; };
  const keys = () => Object.keys(menus).sort((a, b) => toTime(a) - toTime(b));
  const nextWeekday = (k) => { let n = addDays(k, 1); while ([0, 6].includes(dow(n))) n = addDays(n, 1); return n; };

  function istanbulNow() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour12: false, year: 'numeric', month: '2-digit',
      day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { key: `${p.day}.${p.month}.${p.year}`, minutes: (+p.hour % 24) * 60 + +p.minute };
  }

  function initialSelection() {
    const { key: today, minutes } = istanbulNow();
    const d = dow(today);
    let target = today, reason = '';
    if (d === 0 || d === 6) { target = nextWeekday(today); reason = 'Hafta sonu • Pazartesi menüsü gösteriliyor'; }
    else if (minutes >= CLOSE_MIN) {
      target = nextWeekday(today);
      reason = 'Bugünün yemek saati geçti • ' + (d === 5 ? 'Pazartesi' : 'Yarının') + ' menüsü gösteriliyor';
    }
    rerouted = !!reason;
    $('bannerText').textContent = reason;
    $('bannerBtn').hidden = !menus[today] || d === 0 || d === 6;
    selected = target; weekStart = mondayOf(target);
  }

  function icon(n) {
    const s = n.toLowerCase();
    const map = [[/çorba|şorba/, '🥣'], [/balık|hamsi|somon|levrek/, '🐟'], [/tavuk|piliç|şnitzel/, '🍗'], [/köfte|kebap|kebab|et\b|etli|kıyma|dana|kuzu|sote|güveç|döner/, '🥩'],
      [/pilav|bulgur|pirinç/, '🍚'], [/makarna|spagetti|erişte|noodle|mantı/, '🍝'], [/patates|püre/, '🥔'], [/salata|cacık/, '🥗'],
      [/ayran|yoğurt|süt\b/, '🥛'], [/tatlı|sütlaç|helva|baklava|puding|kek|revani/, '🍮'], [/meyve|elma|portakal|mandalina|muz/, '🍎'],
      [/nohut|fasulye|mercimek|barbunya|kuru/, '🫘'], [/börek|poğaça|pide|lahmacun/, '🥟'], [/sebze|ıspanak|kabak|patlıcan|biber|bezelye|enginar/, '🥬'], [/ekmek/, '🍞']];
    for (const [re, e] of map) if (re.test(s)) return e;
    return '🍽️';
  }

  function renderStrip() {
    const today = istanbulNow().key, strip = $('strip');
    strip.replaceChildren();
    DOW.forEach((label, i) => {
      const k = addDays(weekStart, i);
      const b = el('button', 'day' + (k === selected ? ' sel' : '') + (k === today ? ' today' : '') + (menus[k] ? '' : ' empty-day'));
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', k === selected);
      b.append(el('small', '', label), el('b', '', String(+k.slice(0, 2))));
      b.onclick = () => { selected = k; rerouted = false; render(); };
      strip.append(b);
    });
  }

  function renderMenu() {
    const m = menus[selected], list = $('list');
    list.replaceChildren();
    $('dayTitle').textContent = `${longDate(selected)} ${DAYS[dow(selected)]}`;
    $('kcal').hidden = !(m && m.calories);
    if (m && m.calories) $('kcal').textContent = `🔥 ${m.calories}`;
    $('empty').hidden = !!m; list.hidden = !m;
    if (!m) {
      $('empty').textContent = keys().length ? 'Bu gün için menü yayınlanmadı.' : (rawText == null ? 'Menü yüklenemedi. İnternet bağlantını kontrol et.' : 'Henüz menü yayınlanmadı.');
      return;
    }
    for (const meal of m.meals) {
      const row = el('div', 'item'), info = el('div', 'info');
      const cat = CATS.find((c) => c[0] === meal.category);
      info.append(el('div', 'cat', cat ? cat[1] : meal.category), el('div', 'name', meal.name));
      if (meal.note) info.append(el('span', 'badge', `📍 ${meal.note}`));
      row.append(el('div', 'ico', icon(meal.name)), info);
      list.append(row);
    }
  }

  function render() {
    $('banner').hidden = !(rerouted && selected !== istanbulNow().key);
    $('todayLabel').textContent = longDate(istanbulNow().key);
    renderStrip(); renderMenu();
    $('foot').textContent = updated ? 'Menü güncellendi: ' + new Date(updated).toLocaleString('tr-TR', { timeZone: TZ, day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }) : '';
  }

  /* ---------- Gezinme ---------- */
  const firstInWeek = (mon) => { for (let i = 0; i < 5; i++) if (menus[addDays(mon, i)]) return addDays(mon, i); return mon; };
  $('prevWeek').onclick = () => { weekStart = addDays(weekStart, -7); selected = firstInWeek(weekStart); rerouted = false; render(); };
  $('nextWeek').onclick = () => { weekStart = addDays(weekStart, 7); selected = firstInWeek(weekStart); rerouted = false; render(); };
  $('bannerBtn').onclick = () => { selected = istanbulNow().key; weekStart = mondayOf(selected); rerouted = false; render(); };

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (isIOS && !window.navigator.standalone && !store(() => localStorage.getItem(LS.hint))) $('install').hidden = false;
  $('installClose').onclick = () => { $('install').hidden = true; store(() => localStorage.setItem(LS.hint, '1')); };

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { initialSelection(); render(); load(); }
  });

  const parseText = (t) => P.parseMenu(t);

  function apply(text, modified, first) {
    rawText = text; menus = parseText(text); updated = modified || null;
    if (first || !menus[selected]) initialSelection();
    render();
  }

  async function load() {
    // 1) Anında: son kaydedilen kopya
    const c = store(() => JSON.parse(localStorage.getItem(LS.data)));
    if (c && typeof c.text === 'string') apply(c.text, c.modified, true); else { initialSelection(); render(); }
    // 2) Güncel dosya (SW: önce ağ, çevrimdışıysa önbellek)
    try {
      const res = await fetch(SRC, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      const text = await res.text();
      const modified = res.headers.get('last-modified') ? new Date(res.headers.get('last-modified')).toISOString() : (c && c.modified) || null;
      if (!c || c.text !== text) {
        store(() => localStorage.setItem(LS.data, JSON.stringify({ text, modified })));
        apply(text, modified, !c);
      } else if (modified !== c.modified) { updated = modified; render(); }
    } catch { /* çevrimdışı: kayıtlı kopya gösteriliyor */ }
  }

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  load();
})();
