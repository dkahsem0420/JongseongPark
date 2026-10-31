// 음악 앱 — 보관함, 미니 플레이어, 재생 화면
// 실제 음원은 넣지 않고, 재생 화면에서 Apple Music / YouTube 검색으로 연결
import { SONGS, PLAYLISTS } from './data-music.js';
import { el, esc } from './dom.js';
import { t } from './text.js';
import { GLYPH } from './icons.js';
import { hueOf } from './media.js';
import { toSeconds } from './fmt.js';

const S = (inner, w = 26) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const I = {
  play: (w = 30) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/></svg>`,
  pause: (w = 30) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}"><rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor"/></svg>`,
  next: (w = 30) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}"><path d="M3 5.5v13l8.5-6.5zM12 5.5v13l8.5-6.5z" fill="currentColor"/></svg>`,
  prev: (w = 30) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}"><path d="M21 5.5v13L12.5 12zM12 5.5v13L3.5 12z" fill="currentColor"/></svg>`,
  home: S('<path d="M3.5 10.5L12 3.5l8.5 7V20a.5.5 0 0 1-.5.5h-5v-6h-6v6H4a.5.5 0 0 1-.5-.5z"/>'),
  grid: S('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'),
  radio: S('<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/>'),
  library: `<svg viewBox="0 0 24 24" width="26" height="26"><rect x="3" y="3.5" width="3.2" height="17" rx="1" fill="currentColor"/><rect x="8.2" y="3.5" width="3.2" height="17" rx="1" fill="currentColor"/><rect x="13.4" y="4.2" width="3.2" height="16.5" rx="1" fill="currentColor" transform="rotate(-14 15 12)"/></svg>`,
  search: S('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>'),
  down: S('<path d="M6 9.5l6 6 6-6"/>', 26),
  more: `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,.18)"/><circle cx="7.8" cy="12" r="1.3" fill="#fff"/><circle cx="12" cy="12" r="1.3" fill="#fff"/><circle cx="16.2" cy="12" r="1.3" fill="#fff"/></svg>`,
  note: `<svg viewBox="0 0 24 24" width="40%" height="40%"><path d="M9 18.5V6.5l11-2.5v12" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.6"/><circle cx="6.5" cy="18.5" r="2.5" fill="rgba(255,255,255,.85)"/><circle cx="17.5" cy="16" r="2.5" fill="rgba(255,255,255,.85)"/></svg>`,
};

// ── 재생 상태 (앱을 닫아도 유지) ──
const player = { cur: null, playing: false, elapsed: 0, timer: null };
const len = (i) => toSeconds(SONGS[i]?.length) || 240;
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function cover(i, cls = '') {
  const s = SONGS[i];
  const h = hueOf(s.title + s.artist);
  return `<span class="mu-cover ${cls}" style="--h:${h}">${I.note}${s.cover ? `<img src="${esc(s.cover)}" alt="" onerror="this.remove()">` : ''}</span>`;
}

function tick() {
  if (!player.playing) return;
  player.elapsed += 1;
  if (player.elapsed >= len(player.cur)) { player.cur = (player.cur + 1) % SONGS.length; player.elapsed = 0; refreshAll(true); return; }
  refreshAll(false);
}
function setPlaying(on) {
  player.playing = on;
  clearInterval(player.timer);
  if (on) player.timer = setInterval(tick, 1000);
  refreshAll(false);
}
function playSong(i) {
  player.cur = i; player.elapsed = 0;
  setPlaying(true);
  refreshAll(true);
}
function skip(dir) {
  if (player.cur == null) return;
  if (dir < 0 && player.elapsed > 3) player.elapsed = 0;
  else player.cur = (player.cur + dir + SONGS.length) % SONGS.length, player.elapsed = 0;
  refreshAll(true);
}

// 화면에 떠 있는 미니 플레이어·재생 화면을 새로고침
function refreshAll(songChanged) {
  document.querySelectorAll('[data-mu-mini]').forEach((n) => { n.outerHTML = miniHtml(); });
  document.querySelectorAll('.mu-now').forEach((ov) => {
    if (songChanged) ov.querySelector('.mu-now-inner').innerHTML = nowInner();
    updateNow(ov);
  });
  document.querySelectorAll('.mu-row').forEach((r) => r.classList.toggle('on', Number(r.dataset.song) === player.cur));
}

function miniHtml() {
  if (player.cur == null) return '<div data-mu-mini hidden></div>';
  const s = SONGS[player.cur];
  return `
    <div class="mu-mini" data-mu-mini data-open-now>
      ${cover(player.cur, 'sm')}
      <span class="mu-mini-t">${esc(s.title)}</span>
      <button data-toggle aria-label="재생/일시정지">${player.playing ? I.pause(26) : I.play(26)}</button>
      <button data-next aria-label="다음">${I.next(26)}</button>
    </div>`;
}

function nowInner() {
  const s = SONGS[player.cur];
  const q = encodeURIComponent(`${s.artist} ${s.title}`);
  return `
    <button class="mu-grab" data-close aria-label="닫기"><span></span></button>
    <div class="mu-big">${cover(player.cur, 'lg')}</div>
    <div class="mu-meta"><span><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></span>${I.more}</div>
    <div class="mu-prog"><div class="mu-track"><i></i></div><div class="mu-times"><span class="mu-el"></span><span class="mu-rem"></span></div></div>
    <div class="mu-ctrls">
      <button data-prev aria-label="이전">${I.prev(38)}</button>
      <button data-toggle class="mu-pp" aria-label="재생/일시정지"></button>
      <button data-next aria-label="다음">${I.next(38)}</button>
    </div>
    <div class="mu-links">
      <a href="https://music.apple.com/kr/search?term=${q}" target="_blank" rel="noopener">Apple Music에서 듣기</a>
      <a href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">YouTube에서 찾기</a>
    </div>`;
}

function updateNow(ov) {
  if (player.cur == null) return;
  const L = len(player.cur);
  ov.querySelector('.mu-track i').style.width = `${(player.elapsed / L) * 100}%`;
  ov.querySelector('.mu-el').textContent = mmss(player.elapsed);
  ov.querySelector('.mu-rem').textContent = `-${mmss(L - player.elapsed)}`;
  ov.querySelector('.mu-pp').innerHTML = player.playing ? I.pause(46) : I.play(46);
  ov.classList.toggle('paused', !player.playing);
  ov.style.setProperty('--h', hueOf(SONGS[player.cur].title + SONGS[player.cur].artist));
}

export default function create(ctx) {
  function openNow(page) {
    if (player.cur == null || page.querySelector('.mu-now')) return;
    const ov = el(`<div class="mu-now"><div class="mu-now-inner">${nowInner()}</div></div>`);
    page.appendChild(ov);
    ctx.setStatus('light');
    updateNow(ov);
    ov.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      e.stopPropagation();
      if (e.target.closest('[data-close]')) { ov.classList.add('closing'); ctx.setStatus('dark'); setTimeout(() => ov.remove(), 280); return; }
      if (e.target.closest('[data-toggle]')) setPlaying(!player.playing);
      else if (e.target.closest('[data-next]')) skip(1);
      else if (e.target.closest('[data-prev]')) skip(-1);
      else if (e.target.closest('.mu-track')) {
        const r = ov.querySelector('.mu-track').getBoundingClientRect();
        player.elapsed = Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * len(player.cur));
        updateNow(ov);
      }
    });
    // 아래로 쓸어내려 닫기
    let sy = null;
    ov.addEventListener('pointerdown', (e) => { if (!e.target.closest('button,a,.mu-track')) sy = e.clientY; });
    ov.addEventListener('pointerup', (e) => {
      if (sy != null && e.clientY - sy > 80) { ov.classList.add('closing'); ctx.setStatus('dark'); setTimeout(() => ov.remove(), 280); }
      sy = null;
    });
  }

  function library() {
    const p = el(`
      <div class="page mu">
        <div class="page-head has-large">
          <div class="nav"><div class="nav-left"></div><div class="nav-title">보관함</div><div class="nav-right"><span class="nav-btn plain mu-tint">편집</span></div></div>
        </div>
        <div class="page-body">
          <h1 class="large-title">보관함</h1>
          <div class="mu-cats">
            ${['재생목록', '아티스트', '앨범', '노래'].map((c) => `<span>${esc(c)}<i>${GLYPH.chevronRight}</i></span>`).join('')}
          </div>
          <p class="mu-sec">재생목록</p>
          <div class="mu-pls">
            ${PLAYLISTS.map((pl) => `
              <button class="mu-pl" data-song="${pl.songs[0] ?? 0}">
                <span class="mu-pl-art">${pl.songs.slice(0, 4).map((i) => cover(i, 'tile')).join('')}</span>
                <b>${esc(t(pl.title))}</b><small>${pl.songs.length}곡</small>
              </button>`).join('')}
          </div>
          <p class="mu-sec">노래</p>
          <div class="mu-songs">
            ${SONGS.map((s, i) => `
              <button class="mu-row${player.cur === i ? ' on' : ''}" data-song="${i}">
                ${cover(i, 'sm')}
                <span class="mu-row-main"><b>${esc(s.title)}</b><small>${esc(s.artist)}</small></span>
                <span class="mu-eq"><i></i><i></i><i></i></span>
              </button>`).join('')}
          </div>
        </div>
        ${miniHtml()}
        <nav class="ios-tabs mu-tabs">
          <span>${I.home}<small>홈</small></span><span>${I.grid}<small>새로운 항목</small></span><span>${I.radio}<small>라디오</small></span>
          <span class="on">${I.library}<small>보관함</small></span><span>${I.search}<small>검색</small></span>
        </nav>
      </div>`);
    p.addEventListener('click', (e) => {
      if (e.target.closest('.mu-now')) return;
      if (e.target.closest('[data-toggle]')) { e.stopPropagation(); setPlaying(!player.playing); return; }
      if (e.target.closest('[data-next]')) { e.stopPropagation(); skip(1); return; }
      if (e.target.closest('[data-open-now]')) { openNow(p); return; }
      const s = e.target.closest('[data-song]');
      if (s) { const i = Number(s.dataset.song); if (player.cur !== i) playSong(i); else if (!player.playing) setPlaying(true); openNow(p); }
    });
    const body = p.querySelector('.page-body');
    body.addEventListener('scroll', () => p.querySelector('.page-head').classList.toggle('scrolled', body.scrollTop > 38), { passive: true });
    return p;
  }

  return { statusStyle: 'dark', page: library };
}
