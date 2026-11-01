// 카카오톡 — 채팅 목록 + 채팅방
import { KAKAO_CHATS } from './data-kakao.js';
import { el, esc } from './dom.js';
import { T, t } from './text.js';
import { personName, avatarHtml } from './people.js';
import { parseDT, ampm, kakaoListLabel, fullDate, now } from './fmt.js';

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
  send: `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M7.6 3.5c-.8 0-2 .9-2.3 2-.5 1.9.4 5 3.4 8s6.2 4 8.1 3.4c1.1-.3 2-1.5 2-2.3 0-.4-.3-.8-.7-1l-2.6-1.5c-.4-.2-1-.2-1.3.2l-.9 1c-.2.2-.6.3-.8.1-.9-.5-1.8-1.2-2.6-2s-1.5-1.7-2-2.6c-.2-.3-.1-.6.1-.8l1-.9c.4-.3.5-.9.2-1.3L8.6 4.2c-.2-.4-.6-.7-1-.7z" fill="currentColor"/></svg>`,
  tabMore: `<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="5.5" cy="12" r="1.7" fill="currentColor"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/><circle cx="18.5" cy="12" r="1.7" fill="currentColor"/></svg>`,
};

// ── 독자가 직접 보낸 메시지 (이 브라우저 메모리에만 있음 → 새로고침하면 사라짐) ──
const typed = new Map(); // 채팅방 id → [{ from, text, d, unread, raw }]
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hhmm = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

// 메시지 목록을 날짜 붙여서 펼치기 (+ 독자가 보낸 메시지)
function expand(chat) {
  let date = '';
  const out = [];
  for (const m of chat.messages) {
    if (m.date) { date = m.date; out.push({ sep: date }); continue; }
    out.push({ ...m, d: parseDT(`${date} ${m.time}`) });
  }
  for (const m of typed.get(chat.id) || []) {
    const ds = ymd(m.d);
    if (ds !== date) { date = ds; out.push({ sep: ds }); }
    out.push({ ...m, time: hhmm(m.d) });
  }
  return out;
}

// 자동 답장 찾기: 띄어쓰기와 끝의 문장부호는 무시하고 비교
const norm = (s) => String(s).replace(/\s+/g, '').replace(/[.!?~,…ㅠㅜ]+$/, '');
function findReply(chat, text) {
  const key = norm(text);
  const r = (chat.replies || []).find((x) =>
    (x.when || []).some((w) => norm(w) === key) ||
    (x.contains || []).some((w) => key.includes(norm(w))));
  if (!r) return null;
  return Array.isArray(r.reply) ? r.reply : [r.reply];
}

const lastMsg = (chat) => { const all = expand(chat).filter((m) => !m.sep); return all[all.length - 1]; };
const chatTitle = (chat) => (chat.title ? t(chat.title) : chat.with.map(personName).join(', '));
// '나와의 채팅'이면 이름 옆에 '나' 표시
const meTag = (chat) => (chat.type === 'self' ? '<i class="kk-metag">나</i>' : '');
const isGroup = (chat) => chat.with.length > 1;

function preview(m) {
  if (!m) return '';
  if (m.image) return '사진을 보냈습니다.';
  if (m.card) return m.card.title;
  if (m.call) return m.call.missed ? '부재중 보이스톡' : '보이스톡';
  return (m.raw ? m.text : t(m.text)).split('\n')[0];
}

function avatarBox(chat) {
  if (isGroup(chat)) {
    const ks = chat.with.slice(0, 4);
    return `<span class="kk-av group n${ks.length}">${ks.map((k) => `<span>${avatarHtml(k)}</span>`).join('')}</span>`;
  }
  return `<span class="kk-av${chat.type === 'channel' ? ' channel' : ''}">${avatarHtml(chat.with[0])}</span>`;
}

const textHtml = (m) => (m.raw ? esc(m.text) : T(m.text)).replace(/\n/g, '<br>');

// 안 읽은 메시지 수 (채팅방을 열면 0, 새 메시지가 오면 +1)
const unread = new Map(KAKAO_CHATS.map((c) => [c.id, c.unread || 0]));
export const kakaoUnreadTotal = () => [...unread.values()].reduce((a, b) => a + b, 0);

// 밖에서(알림 등) 새 메시지 넣기 → 열려 있는 화면도 바로 갱신
export function receiveKakao(chatId, from, text, { read = false } = {}) {
  const list = typed.get(chatId) || [];
  typed.set(chatId, list);
  list.push({ from, text, d: now(), raw: false });
  if (!read) unread.set(chatId, (unread.get(chatId) || 0) + 1);
  window.dispatchEvent(new CustomEvent('kakao:update', { detail: chatId }));
}
// 엔딩('혹시 내 폰 너한테 있어?')이 왔는지, 그 뒤 답장을 이미 했는지
const ending = { arrived: false, answered: false };
export const markEnding = () => { ending.arrived = true; };

function endingReply(chat, text) {
  if (chat.type !== 'self' || !ending.arrived || ending.answered || !chat.afterEnding) return null;
  const key = norm(text);
  const r = chat.afterEnding.find((x) => x.any || (x.contains || []).some((w) => key.includes(norm(w))));
  if (!r) return null;
  ending.answered = true;
  return Array.isArray(r.reply) ? r.reply : [r.reply];
}

const isOpenRoom = (chatId) => location.hash === `#/app/kakao/chat/${chatId}`;
export const kakaoRoomOpen = isOpenRoom;

function messagesHtml(chat) {
  const items = expand(chat);
  const isMsg = (x) => x && !x.sep;
  const sameRun = (a, b) => isMsg(a) && isMsg(b) && a.from === b.from && a.time === b.time && a.d.toDateString() === b.d.toDateString();

  return items.map((m, i) => {
    if (m.sep) return `<div class="kk-date"><span>${esc(fullDate(parseDT(m.sep)))}</span></div>`;
    const first = !sameRun(items[i - 1], m);
    const last = !sameRun(m, items[i + 1]);
    const un = m.unread ? `<i>${m.unread}</i>` : '';
    const time = last ? `<span class="kk-t">${un}${esc(ampm(m.d))}</span>` : (un ? `<span class="kk-t">${un}</span>` : '');
    let content;
    if (m.image) content = `<div class="kk-bub img"><img src="${esc(m.image)}" alt="" onerror="this.parentNode.classList.add('missing');this.remove()"></div>`;
    else if (m.card) content = `
      <div class="kk-card">
        <div class="kk-card-head">${esc(t(m.card.title))}</div>
        <div class="kk-card-body">
          <p>${textHtml({ text: m.card.text || '' })}</p>
          ${(m.card.rows || []).map(([k, v]) => `<div class="kk-card-row"><span>${esc(k)}</span><b>${esc(t(v))}</b></div>`).join('')}
          ${m.card.button ? `<span class="kk-card-btn">${esc(m.card.button)}</span>` : ''}
        </div>
      </div>`;
    else if (m.call) content = `
      <div class="kk-bub kk-call${first ? ' tail' : ''}${m.call.missed ? ' missed' : ''}">
        <span class="kk-call-ico">${I.phone}</span>
        <span class="kk-call-txt"><b>${m.call.missed ? '부재중 보이스톡' : '보이스톡'}</b>${m.call.missed ? '' : `<small>통화시간 ${esc(m.call.dur || '')}</small>`}</span>
      </div>`;
    else content = `<div class="kk-bub${first ? ' tail' : ''}">${textHtml(m)}</div>`;

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
}

export default function create(ctx) {
  function list() {
    const p = el(`
      <div class="page kk">
        <div class="kk-head">
          <h1>채팅</h1>
          <span class="kk-head-icons">${I.search}${I.newchat}${I.gear}</span>
        </div>
        <div class="page-body kk-list">
          ${rowsHtml()}
        </div>
        <nav class="kk-tabs">
          <span>${I.tabFriends}</span><span class="on">${I.tabChat}</span><span>${I.tabOpen}</span><span>${I.tabShop}</span><span>${I.tabMore}</span>
        </nav>
      </div>`);
    p.addEventListener('click', (e) => {
      const r = e.target.closest('.kk-row');
      if (r) ctx.go(`chat/${r.dataset.chat}`);
    });
    const onUpdate = () => {
      if (!p.isConnected) { window.removeEventListener('kakao:update', onUpdate); return; }
      p.querySelector('.kk-list').innerHTML = rowsHtml();
    };
    window.addEventListener('kakao:update', onUpdate);
    return p;
  }

  function rowsHtml() {
    const chats = [...KAKAO_CHATS].sort((a, b) => (lastMsg(b)?.d || 0) - (lastMsg(a)?.d || 0));
    return chats.map((c) => {
            const m = lastMsg(c);
            const n = unread.get(c.id) || 0;
            return `
            <button class="kk-row" data-chat="${esc(c.id)}">
              ${avatarBox(c)}
              <span class="kk-mid">
                <span class="kk-name"><b>${esc(chatTitle(c))}</b>${meTag(c)}${isGroup(c) ? `<em>${c.with.length + 1}</em>` : ''}</span>
                <span class="kk-prev">${esc(preview(m))}</span>
              </span>
              <span class="kk-side">
                <span class="kk-time">${m ? esc(kakaoListLabel(m.d)) : ''}</span>
                ${n ? `<span class="kk-badge">${n}</span>` : ''}
              </span>
            </button>`;
          }).join('');
  }

  function room(id) {
    const chat = KAKAO_CHATS.find((c) => c.id === id);
    if (!chat) return list();
    unread.set(chat.id, 0);

    const p = el(`
      <div class="page kk-room">
        <div class="kk-room-head">
          <button class="kk-back" data-nav="back" data-back="" aria-label="뒤로">${I.back}</button>
          <span class="kk-room-title"><b>${esc(chatTitle(chat))}</b>${meTag(chat)}${isGroup(chat) ? `<em>${chat.with.length + 1}</em>` : ''}</span>
          <span class="kk-room-icons">${I.search}${I.menu}</span>
        </div>
        <div class="page-body kk-msgs"></div>
        <form class="kk-input" autocomplete="off">
          <span class="kk-plus">${I.plus}</span>
          <label class="kk-field"><input class="kk-text" maxlength="300" placeholder="메시지 입력" enterkeyhint="send">${I.smile}</label>
          <span class="kk-hash">${I.hash}</span>
          <button type="submit" class="kk-send" aria-label="전송">${I.send}</button>
        </form>
      </div>`);
    const scroller = p.querySelector('.kk-msgs');
    const form = p.querySelector('.kk-input');
    const input = p.querySelector('.kk-text');

    const draw = () => {
      scroller.innerHTML = messagesHtml(chat);
      requestAnimationFrame(() => { scroller.scrollTop = scroller.scrollHeight; });
    };
    draw();

    // 이 방에 새 메시지가 오면 바로 표시 (보고 있으니 읽음 처리)
    const onUpdate = (e) => {
      if (!p.isConnected) { window.removeEventListener('kakao:update', onUpdate); return; }
      if (e.detail === chat.id) { unread.set(chat.id, 0); draw(); }
    };
    window.addEventListener('kakao:update', onUpdate);

    input.addEventListener('input', () => form.classList.toggle('has-text', !!input.value.trim()));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      form.classList.remove('has-text');
      input.focus();

      const list = typed.get(chat.id) || [];
      typed.set(chat.id, list);
      // 상대가 읽지 않으니 '1'이 그대로 남음 (나와의 채팅은 숫자 없음)
      const mine = { from: 'me', text, d: now(), unread: chat.type === 'self' ? 0 : 1, raw: true };
      list.push(mine);
      draw();

      // 미리 써 둔 자동 답장이 있는 방만 답장 (지금은 없음)
      (findReply(chat, text) || []).forEach((r, k) => {
        setTimeout(() => {
          mine.unread = 0;
          list.push({ from: chat.with[0], text: r, d: now(), raw: false });
          draw();
        }, 2300 + k * 1000);
      });

      // 엔딩 뒤 나와의 채팅에 답하면 → 종성이 PC 카톡으로 답장 (한 번)
      const er = endingReply(chat, text);
      if (er) {
        er.forEach((r, k) => setTimeout(() => receiveKakao(chat.id, 'me', r, { read: true }), 2500 + k * 1800));
        return;
      }
      // 처음 보냈을 때 → 종성이 PC 카톡으로 눈치챔 (main.js 가 처리, 방문마다 한 번)
      window.dispatchEvent(new CustomEvent('kakao:sent', { detail: chat.id }));
    });

    return p;
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      return sub[0] === 'chat' ? room(sub[1]) : list();
    },
  };
}
