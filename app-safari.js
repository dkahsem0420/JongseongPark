// Safari — 시작 화면(즐겨찾기 + 방문 기록). 누르면 실제 네이버/구글이 새 창으로 열림
import { FAVORITES, HISTORY } from './data-safari.js';
import { el, esc } from './dom.js';
import { t } from './text.js';
import { parseDT, daysAgo, ampm } from './fmt.js';

const searchUrl = (engine, q) => engine === 'google'
  ? `https://www.google.com/search?q=${encodeURIComponent(q)}`
  : `https://search.naver.com/search.naver?query=${encodeURIComponent(q)}`;

const S = (inner, w = 24) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const I = {
  mag: S('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>', 16),
  clock: S('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', 18),
  back: S('<path d="M15 5l-7 7 7 7"/>'),
  fwd: S('<path d="M9 5l7 7-7 7"/>'),
  share: S('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M8 10H6.5A1.5 1.5 0 0 0 5 11.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H16"/>'),
  book: S('<path d="M12 6.5C10 5 7.5 4.5 4 4.5v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-14c-3.5 0-6 .5-8 2zM12 6.5v14"/>'),
  tabs: S('<rect x="7.5" y="7.5" width="12" height="12" rx="2"/><path d="M4.5 15.5v-10a1 1 0 0 1 1-1h10"/>'),
};

function groupLabel(d) {
  const k = daysAgo(d);
  if (k <= 0) return '오늘';
  if (k === 1) return '어제';
  if (k < 7) return '지난 7일';
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

export default function create() {
  function start() {
    const hist = HISTORY.map((h) => ({ ...h, d: parseDT(h.at) })).sort((a, b) => b.d - a.d);
    const groups = [];
    for (const h of hist) {
      const g = groupLabel(h.d);
      let last = groups[groups.length - 1];
      if (!last || last.label !== g) groups.push((last = { label: g, items: [] }));
      last.items.push(h);
    }
    const when = (d) => (daysAgo(d) < 7 ? ampm(d) : `${d.getMonth() + 1}월 ${d.getDate()}일`);

    const p = el(`
      <div class="page sf">
        <div class="sf-topbar"></div>
        <div class="page-body sf-body">
          <h2 class="sf-h">즐겨찾기</h2>
          <div class="sf-favs">
            ${FAVORITES.map((f) => `
              <a class="sf-fav" href="${esc(f.url)}" target="_blank" rel="noopener">
                <span class="sf-tile" style="--c:${esc(f.color || '#8E8E93')}">${esc(f.letter || f.title[0])}</span>
                <small>${esc(f.title)}</small>
              </a>`).join('')}
          </div>

          <h2 class="sf-h">방문 기록</h2>
          ${groups.map((g) => `
            <p class="sf-glabel">${esc(g.label)}</p>
            <div class="sf-group">
              ${g.items.map((h) => `
                <a class="sf-row" href="${esc(searchUrl(h.engine, t(h.q)))}" target="_blank" rel="noopener">
                  <span class="sf-ico">${I.mag}</span>
                  <span class="sf-main"><b>${esc(t(h.q))}</b><small>${h.engine === 'google' ? 'google.com' : 'search.naver.com'}</small></span>
                  <span class="sf-when">${esc(when(h.d))}</span>
                </a>`).join('')}
            </div>`).join('')}
          <p class="sf-end">이 기기의 방문 기록</p>
        </div>
        <div class="sf-bottom">
          <form class="sf-addr">${I.mag}<input placeholder="검색 또는 웹 사이트 이름 입력" enterkeyhint="go" autocomplete="off"></form>
          <div class="sf-tools"><span>${I.back}</span><span class="off">${I.fwd}</span><span>${I.share}</span><span>${I.book}</span><span>${I.tabs}</span></div>
        </div>
      </div>`);

    // 주소창에 입력하면 실제 네이버 검색이 새 창으로
    p.querySelector('.sf-addr').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = e.currentTarget.querySelector('input');
      const q = input.value.trim();
      if (!q) return;
      const url = /^https?:\/\//.test(q) ? q : /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(q) ? `https://${q}` : searchUrl('naver', q);
      window.open(url, '_blank', 'noopener');
      input.value = '';
      input.blur();
    });
    return p;
  }

  return { statusStyle: 'dark', page: start };
}
