// 메시지 앱 (문자/iMessage) — 목록 + 대화
import { SMS_THREADS } from './data-messages.js';
import { el, esc } from './dom.js';
import { T } from './text.js';
import { GLYPH } from './icons.js';
import { personName, avatarHtml } from './people.js';
import { parseDT, iosListLabel, imsgStamp } from './fmt.js';

const I = {
  compose: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M19 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17.8 3.2l3 3L12 15l-3.8.8.8-3.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4.5 7.5h3l1.6-2.3h5.8l1.6 2.3h3a2 2 0 0 1 2 2v8.3a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2z" fill="currentColor"/><circle cx="12" cy="13.3" r="3.6" fill="#fff"/></svg>`,
  mic: `<svg viewBox="0 0 24 24" width="20" height="20"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
};

const withDates = (th) => th.messages.map((m) => ({ ...m, d: parseDT(m.at) }));
const lastOf = (th) => { const a = withDates(th); return a[a.length - 1]; };
const textHtml = (s) => T(s).replace(/\n/g, '<br>').replace(/(https?:\/\/\S+)/g, '<u>$1</u>');

export default function create(ctx) {
  function list() {
    const threads = [...SMS_THREADS].sort((a, b) => lastOf(b).d - lastOf(a).d);
    const p = el(`
      <div class="page msg-app">
        <div class="page-head has-large">
          <div class="nav">
            <div class="nav-left"><button class="nav-btn plain">편집</button></div>
            <div class="nav-title">메시지</div>
            <div class="nav-right"><span class="nav-icon">${I.compose}</span></div>
          </div>
        </div>
        <div class="page-body">
          <h1 class="large-title">메시지</h1>
          <div class="search-field">${GLYPH.search}<span>검색</span></div>
          <div class="msg-list">
            ${threads.map((th) => {
              const m = lastOf(th);
              return `
              <button class="msg-row" data-th="${esc(th.id)}">
                <span class="msg-dot${th.unread ? ' on' : ''}"></span>
                <span class="msg-av">${avatarHtml(th.with)}</span>
                <span class="msg-main">
                  <span class="msg-top"><b>${esc(personName(th.with))}</b><span>${esc(iosListLabel(m.d))}<span class="rchev">${GLYPH.chevronRight}</span></span></span>
                  <span class="msg-prev">${T(m.text).replace(/\n/g, ' ')}</span>
                </span>
              </button>`;
            }).join('')}
          </div>
        </div>
      </div>`);
    p.addEventListener('click', (e) => {
      const r = e.target.closest('.msg-row');
      if (r) ctx.go(`t/${r.dataset.th}`);
    });
    const body = p.querySelector('.page-body');
    body.addEventListener('scroll', () => p.querySelector('.page-head').classList.toggle('scrolled', body.scrollTop > 38), { passive: true });
    return p;
  }

  function thread(id) {
    const th = SMS_THREADS.find((x) => x.id === id);
    if (!th) return list();
    const ms = withDates(th);
    const lastMe = ms.map((m) => m.from).lastIndexOf('me');
    const html = ms.map((m, i) => {
      const prev = ms[i - 1], next = ms[i + 1];
      const stamp = !prev || m.d - prev.d > 60 * 60 * 1000 ? `<p class="im-stamp">${esc(imsgStamp(m.d))}</p>` : '';
      const tail = !next || next.from !== m.from || next.d - m.d > 60 * 60 * 1000;
      const read = th.read && i === lastMe ? `<p class="im-read">읽음</p>` : '';
      return `${stamp}<div class="im-msg ${m.from === 'me' ? 'me' : 'them'}${tail ? ' tail' : ''}"><div class="im-bub">${textHtml(m.text)}</div></div>${read}`;
    }).join('');
    const p = el(`
      <div class="page msg-thread ${th.service === 'sms' ? 'sms' : 'imsg'}">
        <div class="im-head">
          <button class="im-back" data-nav="back" data-back="" aria-label="뒤로">${GLYPH.chevronLeft}</button>
          <span class="im-who"><span class="msg-av">${avatarHtml(th.with)}</span><span class="im-name">${esc(personName(th.with))} ${GLYPH.chevronRight}</span></span>
        </div>
        <div class="page-body im-body">${th.service === 'sms' ? '<p class="im-stamp">문자 메시지</p>' : ''}${html}</div>
        <div class="im-input">
          <span class="im-cam">${I.camera}</span>
          <span class="im-field"><span>${th.service === 'sms' ? '문자 메시지' : 'iMessage'}</span>${I.mic}</span>
        </div>
      </div>`);
    const body = p.querySelector('.im-body');
    requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
    return p;
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      return sub[0] === 't' ? thread(sub[1]) : list();
    },
  };
}
