'use strict';
// Basit form ayrıştırıcı: "Etiket: değer" satırları. Tarih satırı yeni gün başlatır.
const DATE_RE = /(\d{1,2})[./-](\d{1,2})[./-](\d{4})/;
const DAYS_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
const LABELS = { 'çorba': 'Çorba', 'ana yemek': 'Ana Yemek', 'yan yemek': 'Yan Yemek', 'ek': 'Tamamlayıcı' };
const pad = (n) => String(n).padStart(2, '0');
const clean = (s) => String(s || '').replace(/[\u00a0\u200b\ufeff]/g, ' ').replace(/\s+/g, ' ').trim();

function dayNameOf(dateStr) {
  const [d, m, y] = dateStr.split('.').map(Number);
  return DAYS_TR[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

// "Orman Kebabı (Bahçeköy Yerleşkesi)" -> { name: "Orman Kebabı", note: "Bahçeköy Yerleşkesi" }
function splitNote(raw) {
  const notes = [];
  const name = clean(raw.replace(/\(([^)]*)\)?/g, (_, n) => { if (clean(n)) notes.push(clean(n)); return ' '; }));
  return { name, note: notes.join(' · ') };
}

function parseMenu(text) {
  const menus = {};
  let cur = null;
  const finish = () => { if (cur && cur.meals.length) menus[cur.date] = cur; cur = null; };
  for (const raw of String(text).split(/\r?\n/)) {
    const line = clean(raw);
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLocaleLowerCase('tr'), val = clean(m[2]);
    if (key === 'tarih') {
      finish();
      const d = val.match(DATE_RE);
      if (d) { const date = `${pad(d[1])}.${pad(d[2])}.${d[3]}`; cur = { date, dayName: dayNameOf(date), meals: [], calories: '' }; }
    } else if (cur && key === 'kalori') {
      const n = parseInt(val.replace(/\D/g, ''), 10);
      cur.calories = n > 0 ? `${n} Kalori` : '';
    } else if (cur && LABELS[key] && val) {
      const { name, note } = splitNote(val);
      if (name) cur.meals.push({ name, category: LABELS[key], note });
    }
  }
  finish();
  return menus;
}

const api = { parseMenu, dayNameOf };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else window.MenuParse = api;
