// 캘린더 앱 — 월 보기(점 표시), 날짜를 누르면 그날 일정, 일정 상세
import { EVENTS, CALENDARS } from './data-calendar.js';
import { el, esc } from './dom.js';
import { T, t } from './text.js';
import { GLYPH } from './icons.js';
import { storyDate } from './clock.js';
import { WEEKDAY } from './fmt.js';

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const ko = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${pad(m)}`; };
const events = () => EVENTS.map((e, i) => ({ ...e, i }));
const eventsOn = (ds) => events().filter((e) => e.date === ds).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
const color = (e) => (CALENDARS[e.cal] || { color: '#8E8E93' }).color;
const timeText = (e) => (e.time ? `${ko(e.time)}${e.end ? ` – ${ko(e.end)}` : ''}` : '하루 종일');

const I = {
  list: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 7h12M8 12h12M8 17h12"/><circle cx="4" cy="7" r=".8" fill="currentColor"/><circle cx="4" cy="12" r=".8" fill="currentColor"/><circle cx="4" cy="17" r=".8" fill="currentColor"/></svg>`,
  search: `<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
};

// 이번 방문 동안 보고 있던 달·날짜 기억
const state = { month: null, selected: null };

export default function create(ctx) {
  function monthPage() {
    const today = storyDate();
    if (!state.month) state.month = new Date(today.getFullYear(), today.getMonth(), 1);
    if (!state.selected) state.selected = ymd(today);

    const p = el(`
      <div class="page cal">
        <div class="cal-top">
          <span class="cal-year">${GLYPH.chevronLeft}<span></span></span>
          <span class="cal-icons">${I.list}${I.search}${I.plus}</span>
        </div>
        <div class="cal-mhead">
          <h1 class="cal-mtitle"></h1>
          <span class="cal-arrows"><button data-m="-1" aria-label="이전 달">${GLYPH.chevronLeft}</button><button data-m="1" aria-label="다음 달">${GLYPH.chevronLeft}</button></span>
        </div>
        <div class="cal-week">${[...WEEKDAY].map((w, i) => `<span class="${i === 0 || i === 6 ? 'we' : ''}">${w}</span>`).join('')}</div>
        <div class="page-body cal-body">
          <div class="cal-grid"></div>
          <div class="cal-list"></div>
        </div>
        <div class="cal-bar"><button data-today>오늘</button><span>캘린더</span><span>받은 편지함</span></div>
      </div>`);

    function draw() {
      const m = state.month;
      p.querySelector('.cal-year span').textContent = `${m.getFullYear()}년`;
      p.querySelector('.cal-mtitle').textContent = `${m.getMonth() + 1}월`;
      const first = m.getDay();
      const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < first; i++) cells.push('<span class="cal-cell empty"></span>');
      for (let d = 1; d <= days; d++) {
        const date = new Date(m.getFullYear(), m.getMonth(), d);
        const ds = ymd(date);
        const evs = eventsOn(ds);
        const cls = [
          'cal-cell',
          ds === ymd(today) ? 'today' : '',
          ds === state.selected ? 'sel' : '',
          date.getDay() === 0 || date.getDay() === 6 ? 'we' : '',
        ].join(' ');
        cells.push(`
          <button class="${cls}" data-day="${ds}">
            <span class="cal-num">${d}</span>
            <span class="cal-dots">${evs.slice(0, 3).map((e) => `<i style="background:${color(e)}"></i>`).join('')}</span>
          </button>`);
      }
      p.querySelector('.cal-grid').innerHTML = cells.join('');

      const sel = parseYmd(state.selected);
      const evs = eventsOn(state.selected);
      p.querySelector('.cal-list').innerHTML = `
        <p class="cal-ldate">${sel.getMonth() + 1}월 ${sel.getDate()}일 ${WEEKDAY[sel.getDay()]}요일</p>
        ${evs.length ? evs.map((e) => `
          <button class="cal-ev" data-ev="${e.i}">
            <i style="background:${color(e)}"></i>
            <span class="cal-ev-main"><b>${T(e.title)}</b>${e.place ? `<small>${esc(e.place)}</small>` : ''}</span>
            <span class="cal-ev-time">${e.time ? `${esc(ko(e.time))}${e.end ? `<br><small>${esc(ko(e.end))}</small>` : ''}` : '하루 종일'}</span>
          </button>`).join('') : '<p class="cal-none">이벤트 없음</p>'}`;
    }

    p.addEventListener('click', (e) => {
      const day = e.target.closest('[data-day]');
      if (day) { state.selected = day.dataset.day; draw(); return; }
      const mv = e.target.closest('[data-m]');
      if (mv) { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + Number(mv.dataset.m), 1); draw(); return; }
      if (e.target.closest('[data-today]')) {
        const td = storyDate();
        state.month = new Date(td.getFullYear(), td.getMonth(), 1);
        state.selected = ymd(td);
        draw(); return;
      }
      const ev = e.target.closest('[data-ev]');
      if (ev) ctx.go(`e/${ev.dataset.ev}`);
    });

    // 좌우로 밀어서 달 넘기기
    let sx = null;
    const grid = p.querySelector('.cal-grid');
    grid.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    grid.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) { state.month = new Date(state.month.getFullYear(), state.month.getMonth() + (dx < 0 ? 1 : -1), 1); draw(); }
    });

    draw();
    return p;
  }

  function detail(i) {
    const e = events()[i];
    if (!e) return monthPage();
    const d = parseYmd(e.date);
    const cal = CALENDARS[e.cal] || { name: '캘린더', color: '#8E8E93' };
    return el(`
      <div class="page cal grouped">
        <div class="page-head plain-head">
          <div class="nav">
            <div class="nav-left"><button class="nav-back cal-tint" data-nav="back" data-back="">${GLYPH.chevronLeft}<span>${d.getMonth() + 1}월</span></button></div>
            <div class="nav-title"></div>
            <div class="nav-right"><span class="nav-btn plain cal-tint">편집</span></div>
          </div>
        </div>
        <div class="page-body">
          <div class="cal-detail">
            <h2>${T(e.title)}</h2>
            ${e.place ? `<p class="cal-place">${esc(e.place)}</p>` : ''}
            <p class="cal-when">${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY[d.getDay()]})<br>${esc(timeText(e))}</p>
          </div>
          <div class="group">
            <div class="row"><span class="rbody"><span class="rlabel">캘린더</span><span class="rright"><i class="cal-dot" style="background:${cal.color}"></i>${esc(cal.name)}</span></span></div>
            <div class="row"><span class="rbody"><span class="rlabel">알림</span><span class="rright">${e.time ? '30분 전' : '당일 (오전 9시)'}</span></span></div>
          </div>
          ${e.note ? `<div class="group cal-note"><p class="cal-note-t">메모</p><p>${T(e.note)}</p></div>` : ''}
          <div class="group"><div class="row"><span class="rbody"><span class="rlabel" style="color:#FF3B30">이벤트 삭제</span></span></div></div>
        </div>
      </div>`);
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      return sub[0] === 'e' ? detail(Number(sub[1])) : monthPage();
    },
  };
}
