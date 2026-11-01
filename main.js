// 앱 전체 흐름: 이름 입력 → 잠금화면 → 홈화면 → 앱
// 주소는 해시(#/home, #/app/kakao …) 방식이라 GitHub Pages에서 새로고침해도 404가 나지 않습니다.
import { CONFIG } from './config.js';
import { appById } from './apps.js';
import { el, screenScale } from './dom.js';
import { t, T } from './text.js';
import { getVisitor, onVisitorChange, session } from './store.js';
import { createStatusBar } from './statusbar.js';
import { createSetup } from './setup.js';
import { createLock } from './lock.js';
import { createHome } from './home.js';
import { getAppModule } from './index.js';
import { receiveKakao, kakaoUnreadTotal, kakaoRoomOpen, markEnding } from './app-kakao.js';
import { personName } from './people.js';
import { ICONS } from './icons.js';
import { preloadImages } from './preload.js';
import { CALLS } from './data-calls.js';
import { now } from './fmt.js';

const phone = document.getElementById('phone');
const screen = document.getElementById('screen');

// ── 배경화면 (파일이 있을 때만 적용, 없으면 기본 그라데이션) ──
screen.style.setProperty('--wall-lock', 'none');
screen.style.setProperty('--wall-home', 'none');
for (const [key, src] of Object.entries(CONFIG.wallpapers)) {
  if (!src) continue;
  const img = new Image();
  img.onload = () => screen.style.setProperty(`--wall-${key}`, `url("${src}")`);
  img.src = src;
}

// ── PC에서 폰 프레임을 화면 높이에 맞게 축소 ──
function fit() {
  if (window.innerWidth <= 520) { phone.style.removeProperty('--scale'); return; }
  const s = Math.min(1, (window.innerHeight - 32) / 876, (window.innerWidth - 32) / 417);
  phone.style.setProperty('--scale', s.toFixed(4));
}
fit();
window.addEventListener('resize', fit);

// ── 화면 층 만들기 ──
const statusbar = createStatusBar();
const home = createHome({ onOpen: openFromIcon });
const lock = createLock({ onUnlock, onPasscode: (on) => statusbar.hideTime(!on) });
const setup = createSetup({ onDone: onSetupDone });
const indicator = el(`<div class="home-ind" role="button" aria-label="홈으로"><span></span></div>`);
const banner = el(`<div class="banner" role="button" hidden></div>`);

screen.append(home.el, lock.el, setup.el, statusbar.el, banner, indicator);
lock.hide();
setup.el.hidden = true;

onVisitorChange(() => { home.refresh(); if (lock.visible) lock.refresh(); });

// ── 내비게이션 ──
const stack = [];
let replacing = false;
let pending = null; // 잠금 해제 후 갈 주소
let origin = null;  // 앱이 열릴 때 확대되는 시작점
let navDir = 'push'; // 마지막 이동 방향: push(들어감) / pop(뒤로) / none
let forceDir = null;

function nav(hash, { replace = false } = {}) {
  if (location.hash === hash) { route(); return; }
  replacing = replace;
  if (replace) location.replace(hash);
  else location.hash = hash;
}

function trackStack() {
  const h = location.hash || '#/';
  if (replacing) { stack[Math.max(0, stack.length - 1)] = h; replacing = false; navDir = forceDir || 'none'; }
  else if (stack.length > 1 && stack[stack.length - 2] === h) { stack.pop(); navDir = 'pop'; }
  else if (stack[stack.length - 1] !== h) { stack.push(h); navDir = 'push'; }
  forceDir = null;
}

const appHash = (appId, sub) => `#/app/${appId}${sub ? '/' + sub : ''}`;

function goBack(appId, parent) {
  const target = appHash(appId, parent);
  if (stack.length > 1 && stack[stack.length - 2] === target) history.back();
  else { forceDir = 'pop'; nav(target, { replace: true }); }
}

// 앱 안에서 '직전 화면'으로 (어디서 왔는지 모를 때)
function goBackAny(appId) {
  const prev = stack[stack.length - 2];
  if (stack.length > 1 && prev && prev.startsWith(`#/app/${appId}`)) history.back();
  else { forceDir = 'pop'; nav(appHash(appId, ''), { replace: true }); }
}

// ── 앱 열고 닫기 ──
let cur = null; // { id, mod, el, sub, page }

function makeCtx(def) {
  return {
    app: def, t, T,
    go: (sub, opts) => nav(appHash(def.id, sub), opts),
    back: (parent = '') => goBack(def.id, parent),
    backAny: () => goBackAny(def.id),
    setStatus: (style) => { statusbar.setStyle(style); indicator.classList.toggle('dark', style === 'dark'); },
    home: () => nav('#/home'),
    lock: () => nav('#/lock'),
    restart: () => { session.unlocked = false; nav('#/setup', { replace: true }); },
  };
}

function openFromIcon(appId, iconEl) {
  if (iconEl) {
    const r = iconEl.getBoundingClientRect();
    const s = screen.getBoundingClientRect();
    const k = screenScale();
    origin = [(r.left + r.width / 2 - s.left) / k, (r.top + r.height / 2 - s.top) / k];
  }
  nav(`#/app/${appId}`);
}

function openApp(id, sub) {
  if (!cur || cur.id !== id) {
    closeApp(false);
    const def = appById(id);
    const ctx = makeCtx(def);
    const mod = getAppModule(id)(ctx);
    const appEl = el(`<div class="layer app"></div>`);
    const [ox, oy] = origin || [screen.offsetWidth / 2, screen.offsetHeight / 2];
    origin = null;
    appEl.style.transformOrigin = `${ox}px ${oy}px`;
    appEl.classList.add('opening');
    setTimeout(() => appEl.classList.remove('opening'), 450);
    appEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-nav]');
      if (!b) return;
      if (b.dataset.nav === 'back') {
        if (b.dataset.back === '*') ctx.backAny();
        else ctx.back(b.dataset.back ?? cur.sub.slice(0, -1).join('/'));
      }
      if (b.dataset.nav === 'home') nav('#/home');
    });
    screen.insertBefore(appEl, lock.el);
    home.el.classList.add('behind');
    cur = { id, mod, el: appEl, sub: null, page: null, scroll: new Map() };
  }

  const same = cur.sub && cur.sub.join('/') === sub.join('/');
  if (same && cur.page) return;
  // 지금 화면의 스크롤 위치 저장
  if (cur.page && cur.sub) cur.scroll.set(cur.sub.join('/'), cur.page.querySelector('.page-body')?.scrollTop || 0);
  const page = cur.mod.page(sub);
  const old = cur.page;
  if (old && navDir !== 'none') {
    const push = navDir === 'push';
    page.classList.add(push ? 'push-in' : 'pop-in');
    old.classList.add(push ? 'push-out' : 'pop-out');
    setTimeout(() => { old.remove(); page.classList.remove('push-in', 'pop-in'); }, 360);
  } else if (old) old.remove();
  cur.el.appendChild(page);
  cur.page = page;
  cur.sub = sub;
  // 뒤로 돌아온 화면이면 보던 위치로
  const saved = cur.scroll.get(sub.join('/'));
  if (navDir === 'pop' && saved) {
    const body = page.querySelector('.page-body');
    if (body) requestAnimationFrame(() => { body.scrollTop = saved; });
  }
  statusbar.setStyle(cur.mod.statusStyle || 'dark');
  indicator.classList.toggle('dark', (cur.mod.statusStyle || 'dark') === 'dark');
}

function closeApp(animated) {
  if (!cur) return;
  const e = cur.el;
  cur = null;
  home.el.classList.remove('behind');
  if (animated) {
    e.classList.add('closing');
    setTimeout(() => e.remove(), 340);
  } else e.remove();
  statusbar.setStyle('light');
  indicator.classList.remove('dark');
}

// ── 잠금 ──
function showLock() {
  preloadImages(); // 암호 넣는 동안에도 미리 받기
  closeApp(false);
  if (!lock.visible || lock.el.classList.contains('unlocking')) lock.show();
  statusbar.setStyle('light');
  statusbar.hideTime(true);
  indicator.classList.remove('dark');
}

function onUnlock(target) {
  session.unlocked = true;
  scheduleNotifications();
  scheduleIncomingCall();
  preloadImages();
  statusbar.hideTime(false);
  home.el.classList.add('wake');
  setTimeout(() => home.el.classList.remove('wake'), 600);
  const to = target || (pending && pending !== '#/lock' ? pending : '#/home');
  pending = null;
  nav(to, { replace: true });
}

function onSetupDone() {
  session.unlocked = false;
  setup.el.hidden = true;
  screen.classList.add('booting');
  setTimeout(() => screen.classList.remove('booting'), 1200);
  nav('#/home', { replace: true });
}

// ── 라우터 ──
function route() {
  trackStack();
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  indicator.hidden = false;

  if (!getVisitor()) {
    if (parts[0] !== 'setup') return nav('#/setup', { replace: true });
    closeApp(false);
    lock.hide();
    setup.reset();
    setup.el.hidden = false;
    indicator.hidden = true;
    statusbar.setStyle('light');
    statusbar.hideTime(false);
    return;
  }
  setup.el.hidden = true;

  if (parts[0] === 'setup') return nav('#/home', { replace: true });
  if (parts[0] === 'lock') { session.unlocked = false; pending = '#/home'; return showLock(); }
  if (!session.unlocked) { pending = location.hash; return showLock(); }

  if (lock.visible && !lock.el.classList.contains('unlocking')) lock.hide();
  statusbar.hideTime(false);

  if (parts[0] === 'app' && appById(parts[1])) openApp(parts[1], parts.slice(2));
  else if (parts[0] !== 'home') nav('#/home', { replace: true });
  else closeApp(true);
  home.setBadge('kakao', kakaoUnreadTotal());
}

window.addEventListener('hashchange', route);

// ── 둘러보는 도중 내려오는 카톡 알림 (config.js 의 notifications) ──
let notifScheduled = false;
let sentNoticed = false;
let bannerTimer = null;
function scheduleNotifications() {
  if (notifScheduled) return;
  notifScheduled = true;
  for (const n of CONFIG.notifications || []) {
    setTimeout(() => fireNotification(n), (n.after || 60) * 1000);
  }
}
const fired = new Set(); // 알림은 각각 한 번만
let endingDone = false; // 엔딩 대화가 이미 끝났으면 남은 알림은 생략
function fireNotification(n) {
  if (endingDone && n.chat === 'self' && !n.force) return; // 엔딩 대화가 끝났으면 나와의 채팅 알림만 생략
  if (n.ending || n.after) { if (fired.has(n)) return; }
  // 잠겨 있거나 이름 입력 중이면 풀릴 때까지 기다림
  if (!session.unlocked || !getVisitor() || lock.visible) { setTimeout(() => fireNotification(n), 2000); return; }
  if (n.ending || n.after) fired.add(n);
  const viewing = kakaoRoomOpen(n.chat);
  if (n.ending) {
    markEnding(); sentNoticed = true; // 엔딩 뒤에는 '...?' 반응 안 나오게
    // 엔딩 질문에 답이 없으면 일정 시간 뒤 종성 전화
    const jc = CONFIG.jongseongCall;
    if (jc) setTimeout(() => scheduleJongseongCall(0), (jc.ifNoAnswer || 60) * 1000);
  }
  receiveKakao(n.chat, n.from, t(n.text), { read: viewing });
  home.setBadge('kakao', kakaoUnreadTotal());
  navigator.vibrate?.(60);
  if (viewing) return; // 이미 그 채팅방을 보고 있으면 배너 없이 메시지만
  banner.innerHTML = `
    <span class="n-icon">${ICONS.kakao()}</span>
    <span class="n-main">
      <span class="n-top"><b>${T(n.title || personName(n.from))}</b><span class="n-time">지금</span></span>
      <span class="n-body">${T(n.text)}</span>
    </span>`;
  banner.dataset.target = `#/app/kakao/chat/${n.chat}`;
  banner.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('in')));
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(hideBanner, 5500);
}
// 독자가 종성 폰으로 처음 카톡을 보내면 → 잠시 뒤 '나와의 채팅'으로 종성 반응
window.addEventListener('kakao:sent', () => {
  const f = CONFIG.firstSendNotice;
  if (!f || sentNoticed) return;
  sentNoticed = true;
  const texts = f.texts || [f.text];
  texts.forEach((text, k) => {
    setTimeout(() => fireNotification({ ...f, text, after: 0 }), ((f.after || 4) + k * 1.5) * 1000);
  });
  // 이미 눈치챘으니 엔딩을 앞당김 (원래 시간보다 늦어지진 않음)
  const end = (CONFIG.notifications || []).find((x) => x.ending);
  if (end && f.endingAfter) setTimeout(() => fireNotification(end), ((f.after || 4) + f.endingAfter) * 1000);
});

// 나와의 채팅에서 엔딩이 앞당겨지거나 끝난 경우 (app-kakao.js 가 알려 줌)
const endingNotif = () => (CONFIG.notifications || []).find((x) => x.ending);
window.addEventListener('kakao:ending-now', () => {
  const end = endingNotif();
  if (end) setTimeout(() => fireNotification(end), 2500);
});
window.addEventListener('kakao:ending-done', () => { endingDone = true; sentNoticed = true; });

// ── 걸려오는 전화 (config.js 의 incomingCall) ──
let callScheduled = false;
let jongseongCalled = false; // 종성이 재윤 폰으로 걸었으면 재윤 전화는 생략
let callActive = false;
let lastCallEnd = 0; // 전화가 연달아 오지 않게 (끝나고 최소 10초)
function scheduleIncomingCall() {
  const c = CONFIG.incomingCall;
  if (!c || callScheduled) return;
  callScheduled = true;
  setTimeout(() => { if (!jongseongCalled) showIncomingCall(c); }, (c.after || 70) * 1000);
}
// 엔딩 뒤 종성 전화 (한 번만)
function scheduleJongseongCall(delaySec) {
  const jc = CONFIG.jongseongCall;
  if (!jc || jongseongCalled) return;
  jongseongCalled = true;
  setTimeout(() => showIncomingCall(jc), delaySec * 1000);
}
window.addEventListener('kakao:ending-answered', () => {
  const jc = CONFIG.jongseongCall;
  if (jc) setTimeout(() => scheduleJongseongCall(0), (jc.afterAnswer || 25) * 1000);
});
const pad2 = (n) => String(n).padStart(2, '0');
const stamp = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
const PHONE_DOWN = `<svg viewBox="0 0 24 24" width="34" height="34"><path d="M12 9c-2.6 0-5.1.5-7.4 1.5-.9.4-1.5 1.3-1.5 2.3v1.6c0 .7.6 1.2 1.3 1.1l3.2-.5c.6-.1 1-.6 1-1.2v-1.6c1.1-.4 2.2-.5 3.4-.5s2.3.1 3.4.5v1.6c0 .6.4 1.1 1 1.2l3.2.5c.7.1 1.3-.4 1.3-1.1v-1.6c0-1-.6-1.9-1.5-2.3C17.1 9.5 14.6 9 12 9z" fill="#fff"/></svg>`;
const PHONE_UP = `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M7.6 3.5c-.8 0-2 .9-2.3 2-.5 1.9.4 5 3.4 8s6.2 4 8.1 3.4c1.1-.3 2-1.5 2-2.3 0-.4-.3-.8-.7-1l-2.6-1.5c-.4-.2-1-.2-1.3.2l-.9 1c-.2.2-.6.3-.8.1-.9-.5-1.8-1.2-2.6-2s-1.5-1.7-2-2.6c-.2-.3-.1-.6.1-.8l1-.9c.4-.3.5-.9.2-1.3L8.6 4.2c-.2-.4-.6-.7-1-.7z" fill="#fff"/></svg>`;
const CALL_BTNS = [['소리 끔', 'M5 9h3l4-3.5v13L8 15H5zM16 9l5 6M21 9l-5 6'], ['키패드', ''], ['스피커', 'M5 9h3l4-3.5v13L8 15H5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11'], ['FaceTime', 'M3 7.5h11v9H3zM14 11l6-3.5v9L14 13'], ['통화 추가', 'M12 5v14M5 12h14'], ['연락처', 'M12 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5']];

function showIncomingCall(c) {
  // 잠겨 있거나 다른 화면 중이면 풀릴 때까지 기다림
  if (!session.unlocked || !getVisitor() || lock.visible || callActive || Date.now() - lastCallEnd < 10000) { setTimeout(() => showIncomingCall(c), 2000); return; }
  callActive = true;
  const startedAt = now();
  const ov = el(`
    <div class="call-ov ringing">
      <div class="call-head">
        <span class="ic-name">${T(c.from)}</span>
        <span class="ic-sub">${T(c.label || '휴대전화')}</span>
      </div>
      <div class="call-captions"></div>
      <div class="call-grid">${CALL_BTNS.map(([l, d]) => `<span><i>${d ? `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>` : '<b>⋮⋮⋮</b>'}</i><small>${l}</small></span>`).join('')}</div>
      <div class="call-ring-btns">
        <button class="call-btn decline" data-call="decline">${PHONE_DOWN}<small>거절</small></button>
        <button class="call-btn accept" data-call="accept">${PHONE_UP}<small>응답</small></button>
      </div>
      <button class="call-btn end" data-call="end">${PHONE_DOWN}</button>
    </div>`);
  screen.insertBefore(ov, statusbar.el);
  statusbar.setStyle('light');
  indicator.classList.remove('dark');
  requestAnimationFrame(() => ov.classList.add('in'));

  const timers = [];
  const vib = setInterval(() => navigator.vibrate?.([400, 200, 400]), 2000);
  navigator.vibrate?.([400, 200, 400]);
  let state = 'ringing', answeredAt = 0, tick = null;

  const close = () => {
    clearInterval(vib); clearInterval(tick); timers.forEach(clearTimeout);
    navigator.vibrate?.(0);
    callActive = false;
    lastCallEnd = Date.now();
    ov.classList.remove('in');
    setTimeout(() => ov.remove(), 350);
    const st = cur ? (cur.mod.statusStyle || 'dark') : 'light';
    statusbar.setStyle(st); indicator.classList.toggle('dark', !!cur && st === 'dark');
  };
  const record = (type, secs = 0) => {
    CALLS.push({ who: c.from, type, at: stamp(startedAt), dur: type === 'missed' ? undefined : `${Math.floor(secs / 60)}:${pad2(secs % 60)}` });
  };
  // 종성(PC 카톡) '나 폰 잃어버림' → 재윤 답장
  const followUp = (answered, afterMs) => {
    const f = c.followUp;
    if (!f) return;
    setTimeout(() => {
      const end = endingNotif();
      if (endingDone || (end && fired.has(end))) return; // 이미 폰 위치를 아는 상황이면 생략
      receiveKakao(f.chat, 'me', t(f.me), { read: true });
      const replies = answered ? f.ifAnswered : f.ifDeclined;
      (replies || []).forEach((text, k) => setTimeout(() => fireNotification({ chat: f.chat, from: c.from, text }), 2200 + k * 1600));
    }, afterMs + (f.delay || 8) * 1000);
  };
  const declined = () => {
    record('missed');
    close();
    const d = c.declined;
    const n = (d?.texts || []).length;
    (d?.texts || []).forEach((text, k) => setTimeout(() => fireNotification({ chat: d.chat, from: d.from || c.from, title: d.title, text, force: true }), 3000 + k * 1600));
    followUp(false, 3000 + n * 1600);
  };
  const hangup = () => {
    if (state !== 'talking') return;
    state = 'ended';
    const secs = Math.max(1, Math.round((Date.now() - answeredAt) / 1000));
    record('in', secs);
    ov.querySelector('.ic-sub').textContent = '통화 종료';
    clearInterval(tick);
    timers.push(setTimeout(close, 900));
    followUp(true, 900);
  };

  ov.addEventListener('click', (e) => {
    const b = e.target.closest('[data-call]');
    if (!b) return;
    if (state === 'ringing' && b.dataset.call === 'decline') { state = 'ended'; declined(); }
    else if (state === 'ringing' && b.dataset.call === 'accept') {
      state = 'talking'; answeredAt = Date.now();
      clearInterval(vib); navigator.vibrate?.(0);
      ov.classList.remove('ringing'); ov.classList.add('talking');
      const sub = ov.querySelector('.ic-sub');
      sub.textContent = '00:00';
      tick = setInterval(() => { const s = Math.floor((Date.now() - answeredAt) / 1000); sub.textContent = `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; }, 500);
      const box = ov.querySelector('.call-captions');
      (c.lines || []).forEach((ln) => timers.push(setTimeout(() => {
        if (state !== 'talking') return;
        const p = document.createElement('p');
        p.textContent = t(ln.text);
        box.appendChild(p);
        while (box.children.length > 3) box.firstElementChild.remove();
      }, ln.at * 1000)));
      timers.push(setTimeout(hangup, (c.hangupAt || 12) * 1000));
    } else if (state === 'talking' && b.dataset.call === 'end') hangup();
  });
  // 안 받으면 부재중
  timers.push(setTimeout(() => { if (state === 'ringing') { state = 'ended'; declined(); } }, (c.ringFor || 20) * 1000));
}

function hideBanner() {
  banner.classList.remove('in');
  setTimeout(() => { if (!banner.classList.contains('in')) banner.hidden = true; }, 400);
}
banner.addEventListener('click', () => {
  const to = banner.dataset.target;
  hideBanner();
  if (to) nav(to);
});
// 위로 밀면 닫기
let bannerY = null;
banner.addEventListener('pointerdown', (e) => { bannerY = e.clientY; });
banner.addEventListener('pointermove', (e) => {
  if (bannerY != null && bannerY - e.clientY > 20) { bannerY = null; clearTimeout(bannerTimer); hideBanner(); }
});
banner.addEventListener('pointerup', () => { bannerY = null; });

// ── 홈 인디케이터 (하단 막대): 탭하거나 위로 쓸면 홈으로 ──
indicator.addEventListener('click', () => {
  if (lock.visible) lock.unlock();
  else if (cur) nav('#/home');
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cur && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) nav('#/home');
});

route();
