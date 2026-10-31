// 카카오톡 — 채팅 목록 + 채팅방
import { KAKAO_CHATS } from './data-kakao.js';
import { el, esc } from './dom.js';
import { T, t } from './text.js';
import { personName, avatarHtml } from './people.js';
import { parseDT, ampm, kakaoListLabel, fullDate } from './fmt.js';

const I = {
  search: `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M15.5 15.5l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  newchat: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 4C7 4 3 7 3 10.8c0 2.4 1.6 4.5 4 5.7l-.8 3 3.5-2.3c.7.1 1.5.2 2.3.2 5 0 9-3 9-6.8S17 4 12 4z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 7.8v6M9 10.8h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  back: `<svg viewBox="0 0 12 21" width="11" height="20"><path d="M10.5 1.5l-9 9 9 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 6.5h16M4 12h16M4 17.5h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  smile: `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="10" r="1.1" fill="currentColor"/><circle cx="15" cy="10" r="1.1" fill="currentColor"/><path d="M8.5 14c1 1.4 2.1 2 3.5 2s2.5-.6 3.5-2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  hash: `<svg viewBox="0 0 24 24" width="22" height="22"><path d="M9 4l-2 16M17 4l-2 16M4.5 9h16M3.5 15h16" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  tabFriends: `<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="8.5" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M4.5 20.5c.8-4 3.8-6.3 7.5-6.3s6.7 2.3 7.5 6.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  tabChat: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 3.5c-5 0-9 3.1-9 7 0 2.5 1.6 4.6 4.1 5.9l-.9 3.6 4-2.6c.6.1 1.2.1 1.8.1 5 0 9-3.1 9-7s-4-7-9-7z" fill="currentColor"/></svg>`,
  tabOpen: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 3.5c-5 0-9 3.1-9 7 0 2.5 1.6 4.6 4.1 5.9l-.9 3.6 4-2.6c.6.1 1.2.1 1.8.1 5 0 9-3.1 9-7s-4-7-9-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="9" cy="10.5" r="1.2" fill="currentColor"/><circle cx="15" cy="10.5" r="1.2" fill="currentColor"/></svg>`,
  tabShop: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 8h14l-1 12H6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>`,
  tabMore: `<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="5.5" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor"/></svg>`,
};

// 메시지 목록을 날짜 붙여서 펼치기
function expand(chat) {
  let date = '';
  const out = [];
  for (const m of chat.messages) {
    if (m.date) { date = m.date; out.push({ sep: date }); continue; }
    out.push({ ...m, d: parseDT(`${date} ${m.time}`) });
  }
  return out;
}

const lastMsg = (chat) => { const all = expand(chat).filter((m) => !m.sep); return all[all.length - 1]; };
const chatTitle = (chat) => (chat.title ? t(chat.title) : chat.with.map(personName).join(', '));
const isGroup = (chat) => chat.with.length > 1;

function preview(m) {
  if (!m) return '';
  if (m.image) return '사진을 보냈습니다.';
  if (m.card) return m.card.title;
  return t(m.text).split('\n')[0];
}

function avatarBox(chat) {
  if (isGroup(chat)) {
    const ks = chat.with.slice(0, 4);
    return `<span class="kk-av group n${ks.length}">${ks.map((k) => `<span>${avatarHtml(k)}</span>`).join('')}</span>`;
  }
  return `<span class="kk-av${chat.type === 'channel' ? ' channel' : ''}">${avatarHtml(chat.with[0])}</span>`;
}

function textHtml(s) {
  return T(s).replace(/\n/g, '<br>');
}

const opened = new Set(); // 이번 방문에서 열어 본 채팅방

export default function create(ctx) {
  function list() {
    const chats = [...KAKAO_CHATS].sort((a, b) => (lastMsg(b)?.d || 0) - (lastMsg(a)?.d || 0));
    const p = el(`
      <div class="page kk">
        <div class="kk-head">
          <h1>채팅</h1>
          <span class="kk-head-icons">${I.search}${I.newchat}${I.gear}</span>
        </div>
        <div class="page-body kk-list">
          ${chats.map((c) => {
            const m = lastMsg(c);
            return `
            <button class="kk-row" data-chat="${esc(c.id)}">
              ${avatarBox(c)}
              <span class="kk-mid">
                <span class="kk-name"><b>${esc(chatTitle(c))}</b>${isGroup(c) ? `<em>${c.with.length + 1}</em>` : ''}</span>
                <span class="kk-prev">${esc(preview(m))}</span>
              </span>
              <span class="kk-side">
                <span class="kk-time">${m ? esc(kakaoListLabel(m.d)) : ''}</span>
                ${c.unread && !opened.has(c.id) ? `<span class="kk-badge">${c.unread}</span>` : ''}
              </span>
            </button>`;
          }).join('')}
        </div>
        <nav class="kk-tabs">
          <span>${I.tabFriends}</span><span class="on">${I.tabChat}</span><span>${I.tabOpen}</span><span>${I.tabShop}</span><span>${I.tabMore}</span>
        </nav>
      </div>`);
    p.addEventListener('click', (e) => {
      const r = e.target.closest('.kk-row');
      if (r) ctx.go(`chat/${r.dataset.chat}`);
    });
    return p;
  }

  function room(id) {
    const chat = KAKAO_CHATS.find((c) => c.id === id);
    if (!chat) return list();
    opened.add(chat.id);
    const items = expand(chat);
    const isMsg = (x) => x && !x.sep;
    const sameRun = (a, b) => isMsg(a) && isMsg(b) && a.from === b.from && a.time === b.time && a.d.toDateString() === b.d.toDateString();

    const body = items.map((m, i) => {
      if (m.sep) return `<div class="kk-date"><span>${esc(fullDate(parseDT(m.sep)))}</span></div>`;
      const first = !sameRun(items[i - 1], m);
      const last = !sameRun(m, items[i + 1]);
      const time = last ? `<span class="kk-t">${m.unread ? `<i>${m.unread}</i>` : ''}${esc(ampm(m.d))}</span>` : (m.unread ? `<span class="kk-t"><i>${m.unread}</i></span>` : '');
      let content;
      if (m.image) content = `<div class="kk-bub img"><img src="${esc(m.image)}" alt="" onerror="this.parentNode.classList.add('missing');this.remove()"></div>`;
      else if (m.card) content = `
        <div class="kk-card">
          <div class="kk-card-head">${esc(t(m.card.title))}</div>
          <div class="kk-card-body">
            <p>${textHtml(m.card.text || '')}</p>
            ${(m.card.rows || []).map(([k, v]) => `<div class="kk-card-row"><span>${esc(k)}</span><b>${esc(t(v))}</b></div>`).join('')}
            ${m.card.button ? `<span class="kk-card-btn">${esc(m.card.button)}</span>` : ''}
          </div>
        </div>`;
      else content = `<div class="kk-bub${first ? ' tail' : ''}">${textHtml(m.text)}</div>`;

      if (m.from === 'me') {
        return `<div class="kk-msg me${first ? ' first' : ''}"><div class="kk-line">${time}${content}</div></div>`;
      }
      return `
        <div class="kk-msg them${first ? ' first' : ''}">
          <span class="kk-av-s">${first ? `<span class="kk-av${chat.type === 'channel' ? ' channel' : ''}">${avatarHtml(m.from)}</span>` : ''}</span>
          <div class="kk-col">
            ${first ? `<span class="kk-sender">${esc(personName(m.from))}</span>` : ''}
            <div class="kk-line">${content}${time}</div>
          </div>
        </div>`;
    }).join('');

    const p = el(`
      <div class="page kk-room">
        <div class="kk-room-head">
          <button class="kk-back" data-nav="back" data-back="" aria-label="뒤로">${I.back}</button>
          <span class="kk-room-title"><b>${esc(chatTitle(chat))}</b>${isGroup(chat) ? `<em>${chat.with.length + 1}</em>` : ''}</span>
          <span class="kk-room-icons">${I.search}${I.menu}</span>
        </div>
        <div class="page-body kk-msgs">${body}</div>
        <div class="kk-input">
          <span class="kk-plus">${I.plus}</span>
          <span class="kk-field"><span>메시지 입력</span>${I.smile}</span>
          <span class="kk-hash">${I.hash}</span>
        </div>
      </div>`);
    const scroller = p.querySelector('.kk-msgs');
    requestAnimationFrame(() => { scroller.scrollTop = scroller.scrollHeight; });
    return p;
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      return sub[0] === 'chat' ? room(sub[1]) : list();
    },
  };
}
