// 전화 앱 — 최근 통화 목록 + 상세
import { CALLS } from './data-calls.js';
import { el, esc } from './dom.js';
import { GLYPH } from './icons.js';
import { personName, avatarHtml } from './people.js';
import { parseDT, iosListLabel, ampm, fullDate, durationKo, toSeconds, daysAgo, WEEKDAY } from './fmt.js';

const I = {
  out: `<svg viewBox="0 0 16 16" width="13" height="13"><path d="M5.2 2.6c-.5 0-1.3.6-1.5 1.3-.3 1.2.2 3.2 2.2 5.2s4 2.6 5.2 2.2c.7-.2 1.3-1 1.3-1.5 0-.3-.2-.5-.4-.6l-1.7-.9c-.3-.2-.6-.1-.8.1l-.6.7c-.1.1-.3.2-.5.1-.5-.3-1.1-.8-1.6-1.3S5.9 7 5.6 6.5c-.1-.2 0-.4.1-.5l.7-.6c.2-.2.3-.5.1-.8l-.9-1.7c-.1-.2-.3-.3-.4-.3z" fill="currentColor"/><path d="M10 2h4v4M14 2l-4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  info: `<svg viewBox="0 0 22 22" width="22" height="22"><circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="11" cy="6.6" r="1.1" fill="currentColor"/><path d="M11 9.6v6.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  star: `<svg viewBox="0 0 24 24" width="25" height="25"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill="currentColor"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="25" height="25"><circle cx="12" cy="12" r="9.5" fill="currentColor"/><path d="M12 6.5V12l3.5 2.2" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  person: `<svg viewBox="0 0 24 24" width="25" height="25"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="9.6" r="3.4" fill="#fff"/><path d="M5.8 18.6c1.3-2.6 3.5-3.9 6.2-3.9s4.9 1.3 6.2 3.9" fill="#fff"/></svg>`,
  keypad: `<svg viewBox="0 0 24 24" width="25" height="25">${[5, 12, 19].flatMap((y) => [5, 12, 19].map((x) => `<circle cx="${x}" cy="${y - 1}" r="2.4" fill="currentColor"/>`)).join('')}<circle cx="12" cy="23" r="0" /></svg>`,
  voicemail: `<svg viewBox="0 0 28 24" width="28" height="25"><circle cx="7" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="21" cy="12" r="4.6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M7 16.6h14" stroke="currentColor" stroke-width="2.2"/></svg>`,
  msg: `<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4C7 4 3 7.2 3 11.2c0 2.3 1.3 4.3 3.4 5.6-.2 1.1-.8 2.1-1.6 2.8 1.6.1 3.1-.4 4.3-1.4.9.2 1.9.4 2.9.4 5 0 9-3.2 9-7.2S17 4 12 4z" fill="currentColor"/></svg>`,
  call: `<svg viewBox="0 0 24 24" width="22" height="22"><path d="M7.6 3.5c-.8 0-2 .9-2.3 2-.5 1.9.4 5 3.4 8s6.2 4 8.1 3.4c1.1-.3 2-1.5 2-2.3 0-.4-.3-.8-.7-1l-2.6-1.5c-.4-.2-1-.2-1.3.2l-.9 1c-.2.2-.6.3-.8.1-.9-.5-1.8-1.2-2.6-2s-1.5-1.7-2-2.6c-.2-.3-.1-.6.1-.8l1-.9c.4-.3.5-.9.2-1.3L8.6 4.2c-.2-.4-.6-.7-1-.7z" fill="currentColor"/></svg>`,
  video: `<svg viewBox="0 0 24 24" width="24" height="22"><rect x="2.5" y="6" width="13" height="12" rx="3" fill="currentColor"/><path d="M16.5 10.5l5-3v9l-5-3z" fill="currentColor"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" width="22" height="22"><rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="currentColor"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5" fill="none" stroke="#fff" stroke-width="1.5"/></svg>`,
};

const calls = () => CALLS.map((c, i) => ({ ...c, i, d: parseDT(c.at) })).sort((a, b) => b.d - a.d);
const isMissed = (c) => c.type === 'missed';
const isNumber = (who) => /^[0-9+\-\s]+$/.test(who);

function typeLabel(c) {
  if (c.type === 'missed') return '부재중 전화';
  if (c.type === 'in') return '수신 전화';
  return '발신 전화';
}

export default function create(ctx) {
  let filter = 'all';

  function recents() {
    const p = el(`
      <div class="page phone-app">
        <div class="page-head has-large">
          <div class="nav">
            <div class="nav-left"><button class="nav-btn plain">편집</button></div>
            <div class="seg"><button data-f="all">모두</button><button data-f="missed">부재중</button></div>
            <div class="nav-right"></div>
          </div>
        </div>
        <div class="page-body">
          <h1 class="large-title">최근 통화</h1>
          <div class="call-list"></div>
        </div>
        ${tabbar()}
      </div>`);
    const list = p.querySelector('.call-list');
    const draw = () => {
      p.querySelectorAll('.seg button').forEach((b) => b.classList.toggle('on', b.dataset.f === filter));
      const items = calls().filter((c) => filter === 'all' || isMissed(c));
      list.innerHTML = items.map((c) => `
        <button class="call-row" data-i="${c.i}">
          <span class="call-ico">${c.type === 'out' ? I.out : ''}</span>
          <span class="call-main">
            <span class="call-name${isMissed(c) ? ' missed' : ''}">${esc(personName(c.who))}</span>
            <span class="call-sub">${isNumber(c.who) ? '대한민국' : '휴대전화'}</span>
          </span>
          <span class="call-when">${esc(iosListLabel(c.d))}</span>
          <span class="call-info">${I.info}</span>
        </button>`).join('');
    };
    p.querySelector('.seg').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) { filter = b.dataset.f; draw(); }
    });
    list.addEventListener('click', (e) => {
      const r = e.target.closest('.call-row');
      if (r) ctx.go(`call/${r.dataset.i}`);
    });
    p.querySelector('.page-body').addEventListener('scroll', (e) => {
      p.querySelector('.page-head').classList.toggle('scrolled', e.target.scrollTop > 38);
    }, { passive: true });
    draw();
    return p;
  }

  function detail(i) {
    const base = CALLS[i];
    if (!base) return recents();
    const who = base.who;
    // 같은 사람과의 통화를 날짜별로 묶어서 보여줌
    const mine = calls().filter((c) => c.who === who);
    const byDay = [];
    for (const c of mine) {
      const key = c.at.slice(0, 10);
      let g = byDay.find((x) => x.key === key);
      if (!g) byDay.push((g = { key, d: c.d, items: [] }));
      g.items.push(c);
    }
    const dayTitle = (d) => {
      const k = daysAgo(d);
      if (k <= 0) return '오늘';
      if (k === 1) return '어제';
      return `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAY[d.getDay()]}요일`;
    };
    const total = mine.reduce((s, c) => s + toSeconds(c.dur), 0);

    return el(`
      <div class="page phone-app grouped">
        <div class="page-head plain-head">
          <div class="nav">
            <div class="nav-left"><button class="nav-back" data-nav="back" data-back="">${GLYPH.chevronLeft}<span>최근 통화</span></button></div>
            <div class="nav-title"></div>
            <div class="nav-right"><button class="nav-btn plain">편집</button></div>
          </div>
        </div>
        <div class="page-body">
          <div class="contact-top">
            <span class="contact-av">${avatarHtml(who)}</span>
            <p class="contact-name">${esc(personName(who))}</p>
          </div>
          <div class="contact-actions">
            <span>${I.msg}<small>메시지</small></span>
            <span>${I.call}<small>전화</small></span>
            <span>${I.video}<small>영상</small></span>
            <span>${I.mail}<small>메일</small></span>
          </div>
          ${byDay.map((g) => `
            <div class="group call-day">
              <p class="call-day-title">${esc(dayTitle(g.d))}</p>
              ${g.items.map((c) => `
                <div class="call-line">
                  <span class="cl-time">${esc(ampm(c.d))}</span>
                  <span class="cl-type${isMissed(c) ? ' missed' : ''}">${typeLabel(c)}</span>
                  <span class="cl-dur">${c.type === 'missed' ? '' : toSeconds(c.dur) ? esc(durationKo(c.dur)) : '응답 없음'}</span>
                </div>`).join('')}
            </div>`).join('')}
          ${total ? `<p class="group-footer call-total">최근 통화 시간 합계 ${esc(durationKo(String(total)))}</p>` : ''}
        </div>
      </div>`);
  }

  function tabbar() {
    const tabs = [['star', '즐겨찾기'], ['clock', '최근 통화'], ['person', '연락처'], ['keypad', '키패드'], ['voicemail', '음성 사서함']];
    return `<nav class="ios-tabs">${tabs.map(([k, l]) => `<span class="${k === 'clock' ? 'on' : ''}">${I[k]}<small>${l}</small></span>`).join('')}</nav>`;
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      return sub[0] === 'call' ? detail(Number(sub[1])) : recents();
    },
  };
}
