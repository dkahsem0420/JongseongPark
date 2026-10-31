// 메모 앱 — 목록 + 메모 보기 + 잠긴 메모(절대 안 열림)
import { NOTES } from './data-notes.js';
import { el, esc } from './dom.js';
import { T, t } from './text.js';
import { GLYPH } from './icons.js';
import { parseDT, iosListLabel, daysAgo, now } from './fmt.js';

const I = {
  lock: `<svg viewBox="0 0 16 21" width="11" height="14"><path d="M3.5 9V6a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="1" y="8.5" width="14" height="11.5" rx="2.5" fill="currentColor"/></svg>`,
  bigLock: `<svg viewBox="0 0 16 21" width="44" height="58"><path d="M3.5 9V6a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="1" y="8.5" width="14" height="11.5" rx="2.5" fill="currentColor"/></svg>`,
  compose: `<svg viewBox="0 0 24 24" width="25" height="25"><path d="M19 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17.8 3.2l3 3L12 15l-3.8.8.8-3.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  share: `<svg viewBox="0 0 24 24" width="23" height="23"><path d="M12 3v12M8 7l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10H6.5a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H16" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  more: `<svg viewBox="0 0 24 24" width="25" height="25"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="7.8" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="16.2" cy="12" r="1.3" fill="currentColor"/></svg>`,
  check: `<svg viewBox="0 0 22 22" width="22" height="22"><circle cx="11" cy="11" r="10" fill="currentColor"/><path d="M6.5 11.3l3 3 6-6.3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  circle: `<svg viewBox="0 0 22 22" width="22" height="22"><circle cx="11" cy="11" r="10" fill="none" stroke="#C7C7CC" stroke-width="1.5"/></svg>`,
};

const notes = () => NOTES.map((n) => ({ ...n, d: parseDT(n.at) })).sort((a, b) => b.d - a.d);
const ampmLong = (d) => { const h = d.getHours(); return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}`; };

function firstLine(n) {
  if (n.locked) return '잠김';
  const line = (n.body || '').split('\n').find((l) => l.trim()) || '추가 텍스트 없음';
  return t(line.replace(/^-\s*(\[[ x]\]\s*)?/, ''));
}

function bodyHtml(body) {
  return (body || '').split('\n').map((raw) => {
    const line = raw.trimEnd();
    let m;
    if ((m = line.match(/^-\s*\[( |x)\]\s*(.*)$/i))) {
      const done = m[1].toLowerCase() === 'x';
      return `<div class="nt-check${done ? ' done' : ''}"><span>${done ? I.check : I.circle}</span><p>${T(m[2])}</p></div>`;
    }
    if ((m = line.match(/^-\s+(.*)$/))) return `<div class="nt-dash"><span>-</span><p>${T(m[1])}</p></div>`;
    if (!line.trim()) return '<div class="nt-gap"></div>';
    return `<p class="nt-p">${T(line)}</p>`;
  }).join('');
}

export default function create(ctx) {
  function list() {
    const all = notes();
    const pinned = all.filter((n) => n.pinned);
    const rest = all.filter((n) => !n.pinned);
    const sections = [];
    if (pinned.length) sections.push(['고정됨', pinned]);
    const week = rest.filter((n) => daysAgo(n.d) < 7);
    const month = rest.filter((n) => daysAgo(n.d) >= 7 && daysAgo(n.d) < 30);
    const older = rest.filter((n) => daysAgo(n.d) >= 30);
    if (week.length) sections.push(['이전 7일', week]);
    if (month.length) sections.push(['이전 30일', month]);
    // 30일보다 오래된 메모는 월별(올해) 또는 연도별로 묶음
    for (const n of older) {
      const y = n.d.getFullYear();
      const label = y === now().getFullYear() ? `${n.d.getMonth() + 1}월` : `${y}년`;
      const sec = sections.find((x) => x[0] === label);
      sec ? sec[1].push(n) : sections.push([label, [n]]);
    }

    const p = el(`
      <div class="page notes-app grouped">
        <div class="page-head has-large">
          <div class="nav">
            <div class="nav-left"><button class="nav-back nt-tint">${GLYPH.chevronLeft}<span>폴더</span></button></div>
            <div class="nav-title">메모</div>
            <div class="nav-right"><span class="nav-icon nt-tint">${I.more}</span></div>
          </div>
        </div>
        <div class="page-body">
          <h1 class="large-title">메모</h1>
          <div class="search-field">${GLYPH.search}<span>검색</span></div>
          ${sections.map(([title, ns]) => `
            <p class="nt-section">${esc(title)}</p>
            <div class="group">
              ${ns.map((n) => `
                <button class="nt-row" data-id="${esc(n.id)}">
                  <span class="nt-title">${n.locked ? `<span class="nt-lock">${I.lock}</span>` : ''}${T(n.title)}</span>
                  <span class="nt-sub"><b>${esc(iosListLabel(n.d))}</b> ${esc(firstLine(n))}</span>
                </button>`).join('')}
            </div>`).join('')}
        </div>
        <div class="nt-toolbar"><span></span><span class="nt-count">메모 ${all.length}개</span><span class="nt-tint">${I.compose}</span></div>
      </div>`);
    p.addEventListener('click', (e) => {
      const r = e.target.closest('.nt-row');
      if (r) ctx.go(`n/${r.dataset.id}`);
    });
    const body = p.querySelector('.page-body');
    body.addEventListener('scroll', () => p.querySelector('.page-head').classList.toggle('scrolled', body.scrollTop > 38), { passive: true });
    return p;
  }

  function head() {
    return `
      <div class="page-head plain-head">
        <div class="nav">
          <div class="nav-left"><button class="nav-back nt-tint" data-nav="back" data-back="">${GLYPH.chevronLeft}<span>메모</span></button></div>
          <div class="nav-title"></div>
          <div class="nav-right nt-icons nt-tint">${I.share}${I.more}</div>
        </div>
      </div>`;
  }

  function detail(id) {
    const n = notes().find((x) => x.id === id);
    if (!n) return list();
    if (n.locked) return locked(n);
    const d = n.d;
    const stamp = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${ampmLong(d)}`;
    return el(`
      <div class="page notes-app note-view">
        ${head()}
        <div class="page-body nt-body">
          <p class="nt-stamp">${esc(stamp)}</p>
          <h2 class="nt-h">${T(n.title)}</h2>
          ${bodyHtml(n.body)}
        </div>
      </div>`);
  }

  // 잠긴 메모: 어떤 암호를 넣어도 열리지 않음 (내용은 코드에도 없음)
  function locked(n) {
    const p = el(`
      <div class="page notes-app note-view">
        ${head()}
        <div class="page-body nt-locked">
          <span class="nt-biglock">${I.bigLock}</span>
          <p class="nt-lock-title">이 메모는 잠겨 있습니다.</p>
          <p class="nt-lock-sub">이 메모를 보려면 암호를 입력하십시오.</p>
          <button class="nt-view nt-tint">메모 보기</button>
          <form class="nt-pw" hidden>
            <input type="password" inputmode="numeric" autocomplete="off" placeholder="암호">
            <button type="submit" class="nt-tint">확인</button>
          </form>
          <p class="nt-err"></p>
        </div>
      </div>`);
    const form = p.querySelector('.nt-pw');
    const input = form.querySelector('input');
    const err = p.querySelector('.nt-err');
    p.querySelector('.nt-view').addEventListener('click', (e) => {
      e.currentTarget.hidden = true;
      form.hidden = false;
      input.focus();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!input.value) return;
      input.value = '';
      err.textContent = '암호가 올바르지 않습니다.';
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      navigator.vibrate?.(80);
    });
    return p;
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      return sub[0] === 'n' ? detail(sub[1]) : list();
    },
  };
}
