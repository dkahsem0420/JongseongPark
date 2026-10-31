// Instagram — 피드, 스토리, 게시물·댓글, 좋아요, 프로필, 둘러보기, DM
import { IG_ACCOUNTS, IG_FOLLOWING, IG_POSTS, IG_STORIES, IG_DMS } from './data-instagram.js';
import { el, esc } from './dom.js';
import { t, T } from './text.js';
import { parseDT, now, ampm, daysAgo } from './fmt.js';

// ── 아이콘 (직접 그린 단순 선 아이콘) ──
const S = (inner, w = 24) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const I = {
  heart: S('<path d="M12 20.2s-7.6-4.6-8.9-9.3C2.2 7.6 4.2 4.5 7.4 4.5c2 0 3.5 1.1 4.6 2.8 1.1-1.7 2.6-2.8 4.6-2.8 3.2 0 5.2 3.1 4.3 6.4-1.3 4.7-8.9 9.3-8.9 9.3z"/>', 26),
  heartFill: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 20.2s-7.6-4.6-8.9-9.3C2.2 7.6 4.2 4.5 7.4 4.5c2 0 3.5 1.1 4.6 2.8 1.1-1.7 2.6-2.8 4.6-2.8 3.2 0 5.2 3.1 4.3 6.4-1.3 4.7-8.9 9.3-8.9 9.3z" fill="#FF3040"/></svg>`,
  heartSm: S('<path d="M12 20.2s-7.6-4.6-8.9-9.3C2.2 7.6 4.2 4.5 7.4 4.5c2 0 3.5 1.1 4.6 2.8 1.1-1.7 2.6-2.8 4.6-2.8 3.2 0 5.2 3.1 4.3 6.4-1.3 4.7-8.9 9.3-8.9 9.3z"/>', 14),
  comment: S('<path d="M20.5 12a8.5 8.5 0 1 1-3.4-6.8A8.4 8.4 0 0 1 20.5 12c0 1.6-.4 3-1.1 4.3l1.1 4.2-4.2-1.1"/>', 25),
  send: S('<path d="M21 3.5L10.5 13.5M21 3.5l-6.5 17-4-7-7-4z"/>', 25),
  save: S('<path d="M6 3.5h12v17l-6-5-6 5z"/>', 25),
  more: `<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="5.5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18.5" cy="12" r="1.6" fill="currentColor"/></svg>`,
  dm: S('<path d="M12 3.5c-4.9 0-8.5 3.6-8.5 8 0 2.3 1 4.3 2.7 5.7v3.3l3.1-1.7c.9.3 1.8.4 2.7.4 4.9 0 8.5-3.6 8.5-8s-3.6-7.7-8.5-7.7z"/><path d="M7.5 13.5l3-3.2 2.2 2 3.8-3"/>', 26),
  home: S('<path d="M3.5 10.5L12 3.5l8.5 7V20a.5.5 0 0 1-.5.5h-5v-6h-6v6H4a.5.5 0 0 1-.5-.5z"/>', 26),
  homeFill: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M3.5 10.5L12 3.5l8.5 7V20a.5.5 0 0 1-.5.5h-5v-6h-6v6H4a.5.5 0 0 1-.5-.5z" fill="currentColor"/></svg>`,
  search: S('<circle cx="10.5" cy="10.5" r="6.8"/><path d="M15.5 15.5l5 5"/>', 26),
  searchBold: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.8"/><path d="M15.5 15.5l5 5"/></svg>`,
  plus: S('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/>', 26),
  reels: S('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M3.5 8.5h17M9 3.5l2.5 5M14.5 3.5l2.5 5"/><path d="M10.5 11.5v5l4-2.5z" fill="currentColor"/>', 26),
  back: S('<path d="M15 4.5L7.5 12l7.5 7.5"/>', 26),
  menu: S('<path d="M4 7h16M4 12h16M4 17h16"/>', 26),
  grid: S('<rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/>', 24),
  tagged: S('<rect x="4" y="3.5" width="16" height="17" rx="3"/><circle cx="12" cy="10" r="2.8"/><path d="M7.5 18c.9-2.2 2.5-3.3 4.5-3.3s3.6 1.1 4.5 3.3"/>', 24),
  compose: S('<path d="M19 13.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5.5"/><path d="M17.8 3.2l3 3L12 15l-3.8.8.8-3.8z"/>', 25),
  close: S('<path d="M5 5l14 14M19 5L5 19"/>', 28),
  chevDown: S('<path d="M6 9.5l6 6 6-6"/>', 16),
  verified: `<svg viewBox="0 0 24 24" width="14" height="14" class="ig-verified"><path d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-.9 2.8.9 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7.9-2.8-.9-2.8 2.5-1.7.9-2.9 3 .2z" fill="#0095F6"/><path d="M8.2 12.2l2.6 2.6 5-5.2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  reelMark: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#fff" stroke-width="1.9" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M3.5 8.5h17M9 3.5l2.5 5M14.5 3.5l2.5 5"/><path d="M10.5 11.5v5l4-2.5z" fill="#fff"/></svg>`,
};

const SILHOUETTE = `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="15.5" r="7.2" fill="#fff"/><path d="M6.5 37c1.4-7.6 7-11.6 13.5-11.6S32.1 29.4 33.5 37z" fill="#fff"/></svg>`;

// ── 상태 (이번 방문 동안만 유지) ──
const likeState = new Map();   // 게시물 id → { liked, likes }
const seenStories = new Set(); // 본 스토리 주인

// ── 도우미 ──
function acc(key) {
  const a = IG_ACCOUNTS[key] || { username: key, name: key };
  return { key, ...a, username: t(a.username), name: t(a.name), bio: t(a.bio || '') };
}
const userKeyByName = (u) => Object.keys(IG_ACCOUNTS).find((k) => acc(k).username.toLowerCase() === String(u).toLowerCase());
// 아이디 (공식 계정이면 파란 인증 배지)
const uname = (key) => `${esc(acc(key).username)}${IG_ACCOUNTS[key]?.verified ? I.verified : ''}`;
const fmtNum = (n) => Number(n).toLocaleString('ko-KR');
const posts = () => IG_POSTS.map((p) => ({ ...p, d: parseDT(p.at) })).sort((a, b) => b.d - a.d);
const postById = (id) => posts().find((p) => p.id === id);
const postsBy = (key) => posts().filter((p) => p.by === key);
const commentCount = (p) => (p.comments || []).reduce((n, c) => n + 1 + (c.replies || []).length, 0);
const storyOf = (key) => IG_STORIES.find((s) => s.by === key && s.items?.length);
// 스토리 순서: 내 스토리 → 안 본 사람 → 본 사람
function storyOrder() {
  const keys = ['jay', ...IG_FOLLOWING].filter((k) => storyOf(k));
  const mine = keys.filter((k) => k === 'jay');
  const rest = keys.filter((k) => k !== 'jay');
  return [...mine, ...rest.filter((k) => !seenStories.has(k)), ...rest.filter((k) => seenStories.has(k))];
}

function like(p) {
  if (!likeState.has(p.id)) likeState.set(p.id, { liked: !!p.liked, likes: p.likes || 0 });
  return likeState.get(p.id);
}

function ago(d) {
  const min = Math.max(0, Math.floor((now() - d) / 60000));
  if (min < 1) return '방금';
  if (min < 60) return `${min}분`;
  if (min < 60 * 24) return `${Math.floor(min / 60)}시간`;
  const days = daysAgo(d);
  if (days < 7) return `${Math.max(1, days)}일`;
  return `${Math.floor(days / 7)}주`;
}
function feedTime(d) {
  const days = daysAgo(d);
  if (days < 7) { const a = ago(d); return a === '방금' ? a : `${a} 전`; }
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function avatar(key, cls = '') {
  const a = acc(key);
  const img = a.avatar ? `<img src="${esc(a.avatar)}" alt="" onerror="this.remove()">` : '';
  return `<span class="ig-av ${cls}">${SILHOUETTE}${img}</span>`;
}
function ringAvatar(key, cls = '') {
  const has = !!storyOf(key);
  return `<span class="ig-ring${has ? '' : ' none'}${seenStories.has(key) ? ' seen' : ''}" ${has ? `data-story="${key}"` : ''}>${avatar(key, cls)}</span>`;
}

// 사진 자리: 파일이 있으면 사진, 없으면 설명이 적힌 색 칸
function photo(image, alt, seed) {
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) % 360;
  // .mp4 / .mov / .webm 이면 소리 없이 반복 재생되는 영상으로
  const isVideo = /\.(mp4|mov|webm)$/i.test(image || '');
  const media = !image ? ''
    : isVideo ? `<video src="${esc(image)}" autoplay muted loop playsinline preload="metadata" onerror="this.remove()"></video>`
    : `<img src="${esc(image)}" alt="" draggable="false" onerror="this.remove()">`;
  return `<span class="ig-photo" style="--h:${h}"><span class="ig-ph-label">${esc(alt || '사진')}</span>${media}</span>`;
}

// 댓글·캡션 속 @아이디 를 파란 링크로
function richText(s) {
  return T(s).replace(/\n/g, '<br>').replace(/@([A-Za-z0-9._]+)/g, (m, u) => {
    const k = userKeyByName(u);
    return k ? `<a class="ig-mention" data-user="${k}">@${esc(u)}</a>` : m;
  });
}

function msgPreview(m) {
  if (m.share) return m.share.kind === 'reel' ? '릴스를 보냈습니다' : '게시물을 보냈습니다';
  return t(m.text);
}

// DM 속 공유 카드 (릴스·게시물)
function shareCard(sh) {
  const a = acc(sh.by);
  if (sh.kind === 'reel') {
    return `
      <span class="ig-share reel">
        <span class="ig-share-media">${photo(sh.image, sh.alt, sh.image || sh.alt)}<span class="ig-share-mark">${I.reelMark}</span></span>
        <span class="ig-share-over">${avatar(sh.by, 'xs')}<b>${uname(sh.by)}</b></span>
      </span>`;
  }
  return `
    <span class="ig-share post">
      <span class="ig-share-head">${avatar(sh.by, 'xs')}<b>${uname(sh.by)}</b></span>
      <span class="ig-share-media">${photo(sh.image, sh.alt, sh.image || sh.alt)}</span>
      ${sh.caption ? `<span class="ig-share-cap"><b>${esc(a.username)}</b> ${T(sh.caption)}</span>` : ''}
    </span>`;
}

function commentHtml(c, isReply = false) {
  const mention = c.to ? `<a class="ig-mention" data-user="${c.to}">@${esc(acc(c.to).username)}</a> ` : '';
  return `
    <div class="ig-c${isReply ? ' reply' : ''}">
      <span data-user="${c.by}">${avatar(c.by, isReply ? 'xs' : 'sm')}</span>
      <div class="ig-c-main">
        <p><b data-user="${c.by}">${uname(c.by)}</b> <span class="ig-c-time">${esc(ago(parseDT(c.at)))}</span></p>
        <p class="ig-c-text">${mention}${richText(c.text)}</p>
        <span class="ig-c-reply">답글 달기</span>
      </div>
      <span class="ig-c-heart">${I.heartSm}</span>
    </div>`;
}

function tabbar(active) {
  return `
    <nav class="ig-tabs">
      <button data-tab="">${active === 'home' ? I.homeFill : I.home}</button>
      <button data-tab="explore">${active === 'search' ? I.searchBold : I.search}</button>
      <span>${I.plus}</span>
      <span>${I.reels}</span>
      <button data-tab="u/jay" class="ig-tab-me${active === 'me' ? ' on' : ''}">${avatar('jay', 'xs')}</button>
    </nav>`;
}

function postCard(p, { full = false } = {}) {
  const a = acc(p.by);
  const L = like(p);
  return `
    <article class="ig-post" data-post="${p.id}">
      <header class="ig-post-head">
        <span class="ig-who">${ringAvatar(p.by, 'sm')}<b data-user="${p.by}">${uname(p.by)}</b></span>
        <span class="ig-icon">${I.more}</span>
      </header>
      <div class="ig-media" data-media="${p.id}">${photo(p.image, p.alt, p.id)}<span class="ig-bigheart">${I.heartFill}</span></div>
      <div class="ig-actions">
        <button class="ig-like${L.liked ? ' on' : ''}" data-like="${p.id}" aria-label="좋아요">${L.liked ? I.heartFill : I.heart}</button>
        <button data-open="${p.id}" aria-label="댓글">${I.comment}</button>
        <span>${I.send}</span>
        <span class="ig-save">${I.save}</span>
      </div>
      <p class="ig-likes">좋아요 <b>${fmtNum(L.likes)}</b>개</p>
      ${p.caption ? `<p class="ig-cap"><b data-user="${p.by}">${esc(a.username)}</b> ${richText(p.caption)}</p>` : ''}
      ${!full && commentCount(p) ? `<button class="ig-allc" data-open="${p.id}">댓글 ${commentCount(p)}개 모두 보기</button>` : ''}
      <p class="ig-time">${esc(feedTime(p.d))}</p>
    </article>`;
}

export default function create(ctx) {
  // 페이지 공통 클릭 처리
  function wire(page, here = '') {
    let lastTap = { id: null, t: 0 };
    page.addEventListener('click', (e) => {
      const rt = e.target.closest('[data-rtoggle]');
      if (rt) { rt.parentNode.classList.toggle('closed'); return; }
      const story = e.target.closest('[data-story]');
      if (story) { openStory(page, story.dataset.story); return; }
      const user = e.target.closest('[data-user]');
      if (user) { if (`u/${user.dataset.user}` !== here) ctx.go(`u/${user.dataset.user}`); return; }
      const likeBtn = e.target.closest('[data-like]');
      if (likeBtn) { toggleLike(page, likeBtn.dataset.like); return; }
      const media = e.target.closest('[data-media]');
      if (media) {
        const n = Date.now();
        if (lastTap.id === media.dataset.media && n - lastTap.t < 320) {
          const p = postById(media.dataset.media);
          if (p && !like(p).liked) toggleLike(page, p.id);
          const big = media.querySelector('.ig-bigheart');
          big.classList.remove('pop'); void big.offsetWidth; big.classList.add('pop');
          lastTap = { id: null, t: 0 };
        } else lastTap = { id: media.dataset.media, t: n };
        return;
      }
      const open = e.target.closest('[data-open]');
      if (open) { if (`p/${open.dataset.open}` !== here) ctx.go(`p/${open.dataset.open}`); return; }
      const tab = e.target.closest('[data-tab]');
      if (tab) { if (tab.dataset.tab !== here) ctx.go(tab.dataset.tab, { replace: true }); return; }
      const go = e.target.closest('[data-go]');
      if (go) ctx.go(go.dataset.go);
    });
    return page;
  }

  function toggleLike(page, id) {
    const p = postById(id);
    if (!p) return;
    const L = like(p);
    L.liked = !L.liked;
    L.likes += L.liked ? 1 : -1;
    page.querySelectorAll(`.ig-post[data-post="${id}"]`).forEach((art) => {
      const b = art.querySelector('.ig-like');
      b.classList.toggle('on', L.liked);
      b.innerHTML = L.liked ? I.heartFill : I.heart;
      b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      art.querySelector('.ig-likes b').textContent = fmtNum(L.likes);
    });
  }

  // ── 홈 피드 ──
  function feed() {
    const ordered = storyOrder();
    const list = posts().filter((p) => p.by === 'jay' || IG_FOLLOWING.includes(p.by));
    list.sort((a, b) => (b.feedTop ? 1 : 0) - (a.feedTop ? 1 : 0)); // feedTop 게시물을 맨 위로
    return wire(el(`
      <div class="page ig">
        <div class="ig-top">
          <span class="ig-logo">Instagram</span>
          <span class="ig-top-icons"><span>${I.heart}</span><button data-go="dm" aria-label="메시지">${I.dm}</button></span>
        </div>
        <div class="page-body ig-body">
          <div class="ig-stories">
            ${ordered.map((k) => `
              <button class="ig-st" data-story="${k}">
                <span class="ig-ring${seenStories.has(k) ? ' seen' : ''}">${avatar(k, 'lg')}</span>
                <small>${k === 'jay' ? '내 스토리' : esc(acc(k).username)}</small>
              </button>`).join('')}
          </div>
          ${list.map((p) => postCard(p)).join('')}
        </div>
        ${tabbar('home')}
      </div>`));
  }

  // ── 게시물 + 댓글 ──
  function postPage(id) {
    const p = postById(id);
    if (!p) return feed();
    return wire(el(`
      <div class="page ig">
        <div class="ig-bar">
          <button class="ig-icon" data-nav="back" data-back="*" aria-label="뒤로">${I.back}</button>
          <b>게시물</b><span></span>
        </div>
        <div class="page-body ig-body">
          ${postCard(p, { full: true })}
          <div class="ig-comments">
            ${(p.comments || []).map((c) => `
              ${commentHtml(c)}
              ${c.replies?.length ? `
                <div class="ig-replies">
                  <button class="ig-rtoggle" data-rtoggle><span></span><em>답글 숨기기</em><em>답글 ${c.replies.length}개 보기</em></button>
                  <div class="ig-rlist">${c.replies.map((r) => commentHtml(r, true)).join('')}</div>
                </div>` : ''}`).join('') || '<p class="ig-empty">아직 댓글이 없습니다.</p>'}
          </div>
        </div>
        <div class="ig-cbar">${avatar('jay', 'sm')}<span>${esc(acc('jay').username)}(으)로 댓글 달기...</span></div>
      </div>`), `p/${id}`);
  }

  // ── 프로필 ──
  function profile(key) {
    if (!IG_ACCOUNTS[key]) return feed();
    const a = acc(key);
    const mine = key === 'jay';
    const list = postsBy(key);
    const dm = IG_DMS.find((x) => x.with === key);
    const following = IG_FOLLOWING.includes(key);
    return wire(el(`
      <div class="page ig">
        <div class="ig-bar${mine ? ' mine' : ''}">
          ${mine ? '<span></span>' : `<button class="ig-icon" data-nav="back" data-back="*" aria-label="뒤로">${I.back}</button>`}
          <b>${uname(key)}${mine ? ` <span class="ig-chev">${I.chevDown}</span>` : ''}</b>
          <span class="ig-bar-icons">${mine ? `${I.plus}${I.menu}` : I.more}</span>
        </div>
        <div class="page-body ig-body">
          <div class="ig-prof">
            ${ringAvatar(key, 'xl')}
            <div class="ig-stats">
              <span><b>${fmtNum(a.postsCount ?? list.length)}</b><small>게시물</small></span>
              <span><b>${fmtNum(a.followers || 0)}</b><small>팔로워</small></span>
              <span><b>${fmtNum(a.following || 0)}</b><small>팔로잉</small></span>
            </div>
          </div>
          <p class="ig-name">${esc(a.name)}</p>
          ${a.bio ? `<p class="ig-bio">${esc(a.bio).replace(/\n/g, '<br>')}</p>` : ''}
          <div class="ig-btns">
            ${mine
              ? '<span>프로필 편집</span><span>프로필 공유</span>'
              : `${following ? `<span>팔로잉 ${I.chevDown}</span>` : '<span class="ig-follow">팔로우</span>'}<button data-go="${dm ? `dm/${dm.id}` : 'dm'}">메시지</button>`}
          </div>
          <div class="ig-gridtabs"><span class="on">${I.grid}</span><span>${I.reels}</span><span>${I.tagged}</span></div>
          ${list.length
            ? `<div class="ig-grid">${list.map((p) => `<button class="ig-tile" data-open="${p.id}">${photo(p.image, p.alt, p.id)}</button>`).join('')}</div>`
            : a.postsCount
              ? `<div class="ig-grid">${Array.from({ length: 12 }, (_, i) => `<span class="ig-tile">${photo('', ' ', `${key}-${i}`)}</span>`).join('')}</div>`
              : '<p class="ig-empty big">게시물 없음</p>'}
        </div>
        ${tabbar(mine ? 'me' : '')}
      </div>`), `u/${key}`);
  }

  // ── 둘러보기 ──
  function explore() {
    const list = posts().filter((p) => p.by !== 'jay');
    return wire(el(`
      <div class="page ig">
        <div class="ig-searchbar"><span>${I.search}검색</span></div>
        <div class="page-body ig-body">
          <div class="ig-grid">${list.map((p) => `<button class="ig-tile" data-open="${p.id}">${photo(p.image, p.alt, p.id)}</button>`).join('')}</div>
        </div>
        ${tabbar('search')}
      </div>`), 'explore');
  }

  // ── DM 목록 ──
  function dmList() {
    const threads = IG_DMS.map((th) => ({ ...th, last: th.messages[th.messages.length - 1] }))
      .sort((a, b) => parseDT(b.last.at) - parseDT(a.last.at));
    return wire(el(`
      <div class="page ig">
        <div class="ig-bar">
          <button class="ig-icon" data-nav="back" data-back="*" aria-label="뒤로">${I.back}</button>
          <b>${esc(acc('jay').username)} <span class="ig-chev">${I.chevDown}</span></b>
          <span class="ig-bar-icons">${I.compose}</span>
        </div>
        <div class="page-body ig-body">
          <div class="ig-searchbar inline"><span>${I.search}검색</span></div>
          <div class="ig-dm-title"><b>메시지</b><span>요청</span></div>
          ${threads.map((th) => {
            const a = acc(th.with);
            const prefix = th.last.from === 'me' ? '회원님: ' : '';
            return `
            <button class="ig-dm-row" data-go="dm/${th.id}">
              ${avatar(th.with, 'md')}
              <span class="ig-dm-main"><b>${esc(a.name)}${IG_ACCOUNTS[th.with]?.verified ? I.verified : ''}</b><span>${esc(prefix + msgPreview(th.last))}</span></span>
              <span class="ig-dm-ago">${esc(ago(parseDT(th.last.at)))}</span>
            </button>`;
          }).join('')}
        </div>
      </div>`), 'dm');
  }

  // ── DM 대화 ──
  function dmThread(id) {
    const th = IG_DMS.find((x) => x.id === id);
    if (!th) return dmList();
    const a = acc(th.with);
    const ms = th.messages.map((m) => ({ ...m, d: parseDT(m.at) }));
    const lastMe = ms.map((m) => m.from).lastIndexOf('me');
    const stamp = (d) => {
      const k = daysAgo(d);
      if (k <= 0) return ampm(d);
      if (k === 1) return `어제 ${ampm(d)}`;
      return `${d.getMonth() + 1}월 ${d.getDate()}일 ${ampm(d)}`;
    };
    const body = ms.map((m, i) => {
      const prev = ms[i - 1], next = ms[i + 1];
      const st = !prev || m.d - prev.d > 3600000 ? `<p class="ig-stamp">${esc(stamp(m.d))}</p>` : '';
      const lastOfGroup = !next || next.from !== m.from || next.d - m.d > 3600000;
      const seen = th.seen && i === lastMe ? '<p class="ig-seen">읽음</p>' : '';
      const content = m.share ? shareCard(m.share) : `<span class="ig-bub">${T(m.text).replace(/\n/g, '<br>')}</span>`;
      if (m.from === 'me') return `${st}<div class="ig-msg me">${content}</div>${seen}`;
      return `${st}<div class="ig-msg them"><span class="ig-msg-av">${lastOfGroup ? avatar(th.with, 'xs') : ''}</span>${content}</div>`;
    }).join('');
    const p = wire(el(`
      <div class="page ig">
        <div class="ig-bar dm">
          <button class="ig-icon" data-nav="back" data-back="*" aria-label="뒤로">${I.back}</button>
          <span class="ig-dm-who" data-user="${th.with}">${avatar(th.with, 'sm')}<span><b>${esc(a.name)}${IG_ACCOUNTS[th.with]?.verified ? I.verified : ''}</b><small>${esc(a.username)}</small></span></span>
          <span></span>
        </div>
        <div class="page-body ig-body ig-dm-body">
          <div class="ig-dm-intro" data-user="${th.with}">${avatar(th.with, 'xl')}<b>${esc(a.name)}${IG_ACCOUNTS[th.with]?.verified ? I.verified : ''}</b><small>${esc(a.username)} · Instagram</small><span>프로필 보기</span></div>
          ${body}
        </div>
        <div class="ig-dm-input"><span>메시지 입력...</span></div>
      </div>`), `dm/${id}`);
    const sc = p.querySelector('.ig-dm-body');
    requestAnimationFrame(() => { sc.scrollTop = sc.scrollHeight; });
    return p;
  }

  // ── 스토리 보기 ──
  function openStory(page, startKey) {
    const order = storyOrder();
    let ui = Math.max(0, order.indexOf(startKey));
    let ii = 0;
    const ov = el(`
      <div class="ig-story">
        <div class="ig-st-media"></div>
        <div class="ig-st-shade"></div>
        <div class="ig-st-bars"></div>
        <div class="ig-st-head"></div>
        <button class="ig-st-close" aria-label="닫기">${I.close}</button>
        <div class="ig-st-tap left"></div><div class="ig-st-tap right"></div>
        <div class="ig-st-foot"></div>
      </div>`);
    page.appendChild(ov);
    ctx.setStatus('light');

    function show() {
      const key = order[ui];
      const s = storyOf(key);
      const it = s.items[ii];
      seenStories.add(key);
      const a = acc(key);
      ov.querySelector('.ig-st-media').innerHTML = photo(it.image, it.alt, `${key}-${ii}`);
      ov.querySelector('.ig-st-bars').innerHTML = s.items.map((_, k) => `<span><i class="${k < ii ? 'done' : k === ii ? 'run' : ''}"></i></span>`).join('');
      ov.querySelector('.ig-st-head').innerHTML = `${avatar(key, 'sm')}<b data-st-user="${key}">${esc(a.username)}</b><span>${esc(ago(parseDT(it.at)))}</span>`;
      ov.querySelector('.ig-st-foot').innerHTML = key === 'jay'
        ? '<span class="ig-st-activity">활동</span>'
        : `<span class="ig-st-reply">메시지 보내기</span>${I.heart}${I.send}`;
      ov.querySelector('.ig-st-bars .run')?.addEventListener('animationend', next, { once: true });
    }
    function next() {
      ii++;
      if (ii >= storyOf(order[ui]).items.length) { ui++; ii = 0; }
      if (ui >= order.length) close(); else show();
    }
    function prev() {
      ii--;
      if (ii < 0) {
        ui--;
        if (ui < 0) { ui = 0; ii = 0; } else ii = storyOf(order[ui]).items.length - 1;
      }
      show();
    }
    function close() {
      ov.remove();
      ctx.setStatus('dark');
      // 본 스토리는 회색 테두리로
      page.querySelectorAll('[data-story]').forEach((n) => {
        const ring = n.classList.contains('ig-ring') ? n : n.querySelector('.ig-ring');
        if (ring && seenStories.has(n.dataset.story)) ring.classList.add('seen');
      });
    }
    ov.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('.ig-st-close')) return close();
      const u = e.target.closest('[data-st-user]');
      if (u) { close(); ctx.go(`u/${u.dataset.stUser}`); return; }
      if (e.target.closest('.ig-st-tap.left')) return prev();
      if (e.target.closest('.ig-st-tap.right')) return next();
    });
    show();
  }

  return {
    statusStyle: 'dark',
    page(sub) {
      if (sub[0] === 'p') return postPage(sub[1]);
      if (sub[0] === 'u') return profile(sub[1]);
      if (sub[0] === 'explore') return explore();
      if (sub[0] === 'dm') return sub[1] ? dmThread(sub[1]) : dmList();
      return feed();
    },
  };
}
