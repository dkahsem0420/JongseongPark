// 앱 전체 흐름: 이름 입력 → 잠금화면 → 홈화면 → 앱
// 주소는 해시(#/home, #/app/kakao …) 방식이라 GitHub Pages에서 새로고침해도 404가 나지 않습니다.
import { CONFIG } from '../data/config.js';
import { appById } from '../data/apps.js';
import { el, screenScale } from './dom.js';
import { t, T } from './text.js';
import { getVisitor, onVisitorChange, session } from './store.js';
import { createStatusBar } from './ui/statusbar.js';
import { createSetup } from './screens/setup.js';
import { createLock } from './screens/lock.js';
import { createHome } from './screens/home.js';
import { getAppModule } from './apps/index.js';

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
const lock = createLock({ onUnlock });
const setup = createSetup({ onDone: onSetupDone });
const indicator = el(`<div class="home-ind" role="button" aria-label="홈으로"><span></span></div>`);

screen.append(home.el, lock.el, setup.el, statusbar.el, indicator);
lock.hide();
setup.el.hidden = true;

onVisitorChange(() => { home.refresh(); if (lock.visible) lock.refresh(); });

// ── 내비게이션 ──
const stack = [];
let replacing = false;
let pending = null; // 잠금 해제 후 갈 주소
let origin = null;  // 앱이 열릴 때 확대되는 시작점

function nav(hash, { replace = false } = {}) {
  if (location.hash === hash) { route(); return; }
  replacing = replace;
  if (replace) location.replace(hash);
  else location.hash = hash;
}

function trackStack() {
  const h = location.hash || '#/';
  if (replacing) { stack[Math.max(0, stack.length - 1)] = h; replacing = false; }
  else if (stack.length > 1 && stack[stack.length - 2] === h) stack.pop();
  else if (stack[stack.length - 1] !== h) stack.push(h);
}

function goBack(appId, parent) {
  const target = `#/app/${appId}${parent ? '/' + parent : ''}`;
  if (stack.length > 1 && stack[stack.length - 2] === target) history.back();
  else nav(target, { replace: true });
}

// ── 앱 열고 닫기 ──
let cur = null; // { id, mod, el, sub, page }

function makeCtx(def) {
  return {
    app: def, t, T,
    go: (sub) => nav(`#/app/${def.id}/${sub}`),
    back: (parent = '') => goBack(def.id, parent),
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
      if (b.dataset.nav === 'back') ctx.back(cur.sub.slice(0, -1).join('/'));
      if (b.dataset.nav === 'home') nav('#/home');
    });
    screen.insertBefore(appEl, lock.el);
    home.el.classList.add('behind');
    cur = { id, mod, el: appEl, sub: null, page: null };
  }

  const prevDepth = cur.sub ? cur.sub.length : -1;
  const same = cur.sub && cur.sub.join('/') === sub.join('/');
  if (same && cur.page) return;
  const page = cur.mod.page(sub);
  const old = cur.page;
  if (old && prevDepth >= 0 && sub.length !== prevDepth) {
    const push = sub.length > prevDepth;
    page.classList.add(push ? 'push-in' : 'pop-in');
    old.classList.add(push ? 'push-out' : 'pop-out');
    setTimeout(() => { old.remove(); page.classList.remove('push-in', 'pop-in'); }, 360);
  } else if (old) old.remove();
  cur.el.appendChild(page);
  cur.page = page;
  cur.sub = sub;
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
  closeApp(false);
  if (!lock.visible || lock.el.classList.contains('unlocking')) lock.show();
  statusbar.setStyle('light');
  statusbar.hideTime(true);
  indicator.classList.remove('dark');
}

function onUnlock(target) {
  session.unlocked = true;
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
}

window.addEventListener('hashchange', route);

// ── 홈 인디케이터 (하단 막대): 탭하거나 위로 쓸면 홈으로 ──
indicator.addEventListener('click', () => {
  if (lock.visible) lock.unlock();
  else if (cur) nav('#/home');
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cur && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName)) nav('#/home');
});

route();
