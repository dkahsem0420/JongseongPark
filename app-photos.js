// 사진 앱 — 보관함(격자), 앨범, 전체화면 보기
import { PHOTOS, PHOTO_ALBUMS } from './data-photos.js';
import { el, esc } from './dom.js';
import { t } from './text.js';
import { GLYPH } from './icons.js';
import { parseDT, ampm } from './fmt.js';
import { mediaHtml, isVideo } from './media.js';

const S = (inner, w = 26) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const I = {
  library: `<svg viewBox="0 0 24 24" width="26" height="26"><rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/></svg>`,
  foryou: S('<path d="M12 20.5s-7.5-4.5-8.6-9.2C2.6 8 4.6 5 7.6 5c1.9 0 3.3 1 4.4 2.7C13.1 6 14.5 5 16.4 5c3 0 5 3 4.2 6.3-1.1 4.7-8.6 9.2-8.6 9.2z"/>'),
  albums: `<svg viewBox="0 0 24 24" width="26" height="26"><rect x="5" y="2.5" width="14" height="3" rx="1" fill="currentColor" opacity=".5"/><rect x="3" y="7" width="18" height="14.5" rx="2.5" fill="currentColor"/></svg>`,
  search: S('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>'),
  share: S('<path d="M12 3v12M8 7l4-4 4 4"/><path d="M8 10H6.5A1.5 1.5 0 0 0 5 11.5v8A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-8a1.5 1.5 0 0 0-1.5-1.5H16"/>', 24),
  heart: S('<path d="M12 20.5s-7.5-4.5-8.6-9.2C2.6 8 4.6 5 7.6 5c1.9 0 3.3 1 4.4 2.7C13.1 6 14.5 5 16.4 5c3 0 5 3 4.2 6.3-1.1 4.7-8.6 9.2-8.6 9.2z"/>', 24),
  heartFill: `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 20.5s-7.5-4.5-8.6-9.2C2.6 8 4.6 5 7.6 5c1.9 0 3.3 1 4.4 2.7C13.1 6 14.5 5 16.4 5c3 0 5 3 4.2 6.3-1.1 4.7-8.6 9.2-8.6 9.2z" fill="currentColor"/></svg>`,
  info: S('<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".6" fill="currentColor"/>', 24),
  trash: S('<path d="M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5l1 14h9l1-14"/>', 24),
  play: `<svg viewBox="0 0 24 24" width="12" height="12"><path d="M7 4.5v15l12-7.5z" fill="#fff"/></svg>`,
};

const photos = () => PHOTOS.map((p, i) => ({ ...p, i, d: parseDT(p.at) })).sort((a, b) => a.d - b.d);
const favs = new Map(); // 이번 방문 동안 하트 상태

function albumPhotos(id) {
  const all = photos();
  if (id === 'recent') return all;
  if (id === 'fav') return all.filter((p) => (favs.has(p.i) ? favs.get(p.i) : p.fav));
  return all.filter((p) => (p.albums || []).includes(id));
}
function albumTitle(id) {
  if (id === 'recent') return '최근 항목';
  if (id === 'fav') return '즐겨찾는 항목';
  return t(PHOTO_ALBUMS.find((a) => a.id === id)?.title || '앨범');
}

const tile = (p) => `<button class="pho-tile" data-ph="${p.i}">${mediaHtml(p.file, p.alt, { thumb: true })}${isVideo(p.file) ? `<span class="pho-vid">${I.play}</span>` : ''}</button>`;

export default function create(ctx) {
  function tabbar(active) {
    const tabs = [['', 'library', '보관함'], [null, 'foryou', 'For You'], ['albums', 'albums', '앨범'], [null, 'search', '검색']];
    return `<nav class="ios-tabs pho-tabs">${tabs.map(([go, ic, label]) => `<${go != null ? `button data-tab="${go}"` : 'span'} class="${ic === active ? 'on' : ''}">${I[ic]}<small>${label}</small></${go != null ? 'button' : 'span'}>`).join('')}</nav>`;
  }

  function wire(p, list) {
    p.addEventListener('click', (e) => {
      const tb = e.target.closest('[data-tab]');
      if (tb) { ctx.go(tb.dataset.tab, { replace: true }); return; }
      const ph = e.target.closest('[data-ph]');
      if (ph) { openViewer(p, list, Number(ph.dataset.ph)); return; }
      const al = e.target.closest('[data-album]');
      if (al) ctx.go(`a/${al.dataset.album}`);
    });
    return p;
  }

  function library() {
    const list = photos();
    const last = list[list.length - 1];
    const p = wire(el(`
      <div class="page pho">
        <div class="pho-libhead">
          <div><h1>보관함</h1><small>${last ? esc(`${last.d.getFullYear()}년 ${last.d.getMonth() + 1}월 ${last.d.getDate()}일`) : ''}</small></div>
          <span class="pho-pill">선택</span>
        </div>
        <div class="page-body pho-body">
          <div class="pho-grid">${list.map(tile).join('')}</div>
          <p class="pho-count">사진 ${list.filter((x) => !isVideo(x.file)).length}장${list.some((x) => isVideo(x.file)) ? `, 동영상 ${list.filter((x) => isVideo(x.file)).length}개` : ''}</p>
        </div>
        ${tabbar('library')}
      </div>`), list);
    const body = p.querySelector('.pho-body');
    requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
    return p;
  }

  function albumsPage() {
    const ids = ['recent', 'fav', ...PHOTO_ALBUMS.map((a) => a.id)];
    const card = (id) => {
      const ps = albumPhotos(id);
      const cover = ps[ps.length - 1];
      return `
        <button class="pho-album" data-album="${id}">
          <span class="pho-cover">${cover ? mediaHtml(cover.file, cover.alt, { thumb: true }) : '<span class="mph empty"></span>'}</span>
          <b>${esc(albumTitle(id))}</b><small>${ps.length}</small>
        </button>`;
    };
    return wire(el(`
      <div class="page pho">
        <div class="page-head has-large">
          <div class="nav"><div class="nav-left"><span class="nav-icon">${S('<path d="M12 5v14M5 12h14"/>', 24)}</span></div><div class="nav-title">앨범</div><div class="nav-right"></div></div>
        </div>
        <div class="page-body">
          <h1 class="large-title">앨범</h1>
          <div class="pho-sec"><b>나의 앨범</b><span>모두 보기</span></div>
          <div class="pho-albums">${ids.map(card).join('')}</div>
        </div>
        ${tabbar('albums')}
      </div>`), []);
  }

  function album(id) {
    const list = albumPhotos(id);
    const p = wire(el(`
      <div class="page pho">
        <div class="page-head">
          <div class="nav">
            <div class="nav-left"><button class="nav-back" data-nav="back" data-back="albums">${GLYPH.chevronLeft}<span>앨범</span></button></div>
            <div class="nav-title">${esc(albumTitle(id))}</div>
            <div class="nav-right"><span class="nav-btn plain">선택</span></div>
          </div>
        </div>
        <div class="page-body pho-body">
          ${list.length ? `<div class="pho-grid">${list.map(tile).join('')}</div>` : '<p class="pho-empty">사진 없음</p>'}
          <p class="pho-count">${list.length}개의 항목</p>
        </div>
      </div>`), list);
    const body = p.querySelector('.pho-body');
    requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
    return p;
  }

  // ── 전체화면 보기: 좌우로 밀거나 화살표로 넘기기 ──
  function openViewer(page, list, startI) {
    let k = Math.max(0, list.findIndex((x) => x.i === startI));
    const ov = el(`
      <div class="pho-view">
        <div class="pho-vtop">
          <button class="pho-vback" aria-label="닫기">${GLYPH.chevronLeft}</button>
          <span class="pho-vdate"></span>
          <span class="pho-pill dark">편집</span>
        </div>
        <div class="pho-vstage"></div>
        <button class="pho-arrow l" aria-label="이전">${GLYPH.chevronLeft}</button>
        <button class="pho-arrow r" aria-label="다음">${GLYPH.chevronLeft}</button>
        <div class="pho-vbar"><span>${I.share}</span><button class="pho-fav"></button><span>${I.info}</span><span>${I.trash}</span></div>
      </div>`);
    page.appendChild(ov);
    const stage = ov.querySelector('.pho-vstage');
    const isFav = (p) => (favs.has(p.i) ? favs.get(p.i) : !!p.fav);

    function show() {
      const p = list[k];
      stage.innerHTML = mediaHtml(p.file, p.alt, { contain: true });
      ov.querySelector('.pho-vdate').innerHTML = `<b>${p.d.getMonth() + 1}월 ${p.d.getDate()}일</b><small>${esc(ampm(p.d))}</small>`;
      ov.querySelector('.pho-fav').innerHTML = isFav(p) ? I.heartFill : I.heart;
      ov.querySelector('.pho-arrow.l').hidden = k === 0;
      ov.querySelector('.pho-arrow.r').hidden = k === list.length - 1;
    }
    const go = (dir) => { const n = k + dir; if (n >= 0 && n < list.length) { k = n; show(); } };
    const close = () => { ov.remove(); window.removeEventListener('keydown', onKey); };
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Escape') { e.stopPropagation(); close(); }
    };
    window.addEventListener('keydown', onKey);

    let swiped = false;
    ov.addEventListener('click', (e) => {
      e.stopPropagation();
      if (swiped) { swiped = false; return; }
      if (e.target.closest('.pho-vback')) return close();
      if (e.target.closest('.pho-arrow.l')) return go(-1);
      if (e.target.closest('.pho-arrow.r')) return go(1);
      if (e.target.closest('.pho-fav')) { const p = list[k]; favs.set(p.i, !isFav(p)); show(); return; }
      if (e.target.closest('.pho-vstage')) ov.classList.toggle('bare');
    });
    let sx = null;
    stage.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { swiped = true; go(dx < 0 ? 1 : -1); }
    });
    show();
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      if (sub[0] === 'albums') return albumsPage();
      if (sub[0] === 'a') return album(sub[1]);
      return library();
    },
  };
}
